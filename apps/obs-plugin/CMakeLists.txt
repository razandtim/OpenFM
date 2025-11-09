cmake_minimum_required(VERSION 3.20)

project(openfm-obs VERSION 0.1.0)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_AUTOMOC ON)
set(CMAKE_AUTORCC ON)
set(CMAKE_AUTOUIC ON)

# Find Qt6
find_package(Qt6 REQUIRED COMPONENTS Core Widgets WebEngineWidgets WebChannel Network)

# Find OBS
if(NOT DEFINED OBS_SOURCE_DIR)
    if(DEFINED ENV{OBS_SOURCE_DIR})
        set(OBS_SOURCE_DIR $ENV{OBS_SOURCE_DIR})
    else()
        message(FATAL_ERROR "OBS_SOURCE_DIR not set. Please set it to your OBS Studio source directory.")
    endif()
endif()

# OBS include directories
set(OBS_INCLUDE_DIRS
    "${OBS_SOURCE_DIR}/libobs"
    "${OBS_SOURCE_DIR}/UI/obs-frontend-api"
)

# Platform-specific settings
if(WIN32)
    set(OBS_LIB_DIR "${OBS_SOURCE_DIR}/build/libobs/Release" CACHE PATH "OBS library directory")
    set(OBS_FRONTEND_LIB_DIR "${OBS_SOURCE_DIR}/build/UI/obs-frontend-api/Release" CACHE PATH "OBS frontend library directory")
    
    set(OBS_LIBRARIES
        "${OBS_LIB_DIR}/obs.lib"
        "${OBS_FRONTEND_LIB_DIR}/obs-frontend-api.lib"
    )
    
    # Windows specific compile options
    add_compile_options(/W3 /MP)
    
elseif(APPLE)
    set(OBS_LIB_DIR "${OBS_SOURCE_DIR}/build/libobs" CACHE PATH "OBS library directory")
    set(OBS_FRONTEND_LIB_DIR "${OBS_SOURCE_DIR}/build/UI/obs-frontend-api" CACHE PATH "OBS frontend library directory")
    
    set(OBS_LIBRARIES
        "${OBS_LIB_DIR}/libobs.dylib"
        "${OBS_FRONTEND_LIB_DIR}/libobs-frontend-api.dylib"
    )
    
    # macOS specific settings
    set(CMAKE_MACOSX_RPATH ON)
    set(CMAKE_INSTALL_RPATH "@executable_path/../Frameworks")
    
else()
    # Linux
    find_library(OBS_LIB obs PATHS /usr/lib /usr/local/lib)
    find_library(OBS_FRONTEND_LIB obs-frontend-api PATHS /usr/lib /usr/local/lib)
    
    set(OBS_LIBRARIES
        ${OBS_LIB}
        ${OBS_FRONTEND_LIB}
    )
endif()

# Plugin source files
set(PLUGIN_SOURCES
    src/plugin.cpp
    src/plugin.hpp
    src/dock.cpp
    src/dock.hpp
    src/audio_manager.cpp
    src/audio_manager.hpp
    src/ducking.cpp
    src/ducking.hpp
)

# Create plugin library
add_library(${PROJECT_NAME} MODULE ${PLUGIN_SOURCES})

# Include directories
target_include_directories(${PROJECT_NAME} PRIVATE
    ${CMAKE_CURRENT_SOURCE_DIR}/src
    ${OBS_INCLUDE_DIRS}
)

# Link libraries
target_link_libraries(${PROJECT_NAME} PRIVATE
    Qt6::Core
    Qt6::Widgets
    Qt6::WebEngineWidgets
    Qt6::WebChannel
    Qt6::Network
    ${OBS_LIBRARIES}
)

# Platform-specific properties
if(WIN32)
    set_target_properties(${PROJECT_NAME} PROPERTIES
        OUTPUT_NAME "openfm-obs"
        SUFFIX ".dll"
        PREFIX ""
    )
    
    # Copy Qt DLLs to output directory for testing
    add_custom_command(TARGET ${PROJECT_NAME} POST_BUILD
        COMMAND ${CMAKE_COMMAND} -E copy_if_different
            $<TARGET_FILE:Qt6::Core>
            $<TARGET_FILE_DIR:${PROJECT_NAME}>
        COMMAND ${CMAKE_COMMAND} -E copy_if_different
            $<TARGET_FILE:Qt6::Widgets>
            $<TARGET_FILE_DIR:${PROJECT_NAME}>
        COMMAND ${CMAKE_COMMAND} -E copy_if_different
            $<TARGET_FILE:Qt6::WebEngineWidgets>
            $<TARGET_FILE_DIR:${PROJECT_NAME}>
    )
    
elseif(APPLE)
    set_target_properties(${PROJECT_NAME} PROPERTIES
        OUTPUT_NAME "openfm-obs"
        SUFFIX ".so"
        PREFIX ""
        BUNDLE FALSE
    )
    
else()
    set_target_properties(${PROJECT_NAME} PROPERTIES
        OUTPUT_NAME "openfm-obs"
        SUFFIX ".so"
        PREFIX ""
    )
endif()

# Installation
if(WIN32)
    install(TARGETS ${PROJECT_NAME}
        LIBRARY DESTINATION "C:/Program Files/obs-studio/obs-plugins/64bit"
        RUNTIME DESTINATION "C:/Program Files/obs-studio/obs-plugins/64bit"
    )
elseif(APPLE)
    install(TARGETS ${PROJECT_NAME}
        LIBRARY DESTINATION "/Applications/OBS.app/Contents/PlugIns"
    )
else()
    install(TARGETS ${PROJECT_NAME}
        LIBRARY DESTINATION /usr/lib/obs-plugins
    )
endif()

# Print configuration summary
message(STATUS "OpenFM OBS Plugin Configuration:")
message(STATUS "  Version: ${PROJECT_VERSION}")
message(STATUS "  Qt6: ${Qt6_VERSION}")
message(STATUS "  OBS Source: ${OBS_SOURCE_DIR}")
message(STATUS "  OBS Libraries: ${OBS_LIBRARIES}")
message(STATUS "  Build Type: ${CMAKE_BUILD_TYPE}")

# Create a helper script for easy building
if(WIN32)
    file(WRITE "${CMAKE_BINARY_DIR}/build-and-install.ps1"
        "cmake --build . --config Release\n"
        "cmake --install . --config Release\n"
        "Write-Host 'Plugin built and installed successfully!'\n"
    )
    message(STATUS "")
    message(STATUS "To build and install, run: powershell .\\build-and-install.ps1")
endif()
