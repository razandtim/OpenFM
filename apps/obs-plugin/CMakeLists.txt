cmake_minimum_required(VERSION 3.16)

project(openfm-obs-plugin VERSION 0.1.0)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Find OBS
find_package(LibObs REQUIRED)
find_package(Qt6 REQUIRED COMPONENTS Core Widgets WebEngineWidgets)

# Sources
set(SOURCES
    src/plugin.cpp
    src/dock.cpp
    src/audio_manager.cpp
    src/ducking.cpp
)

set(HEADERS
    src/plugin.hpp
    src/dock.hpp
    src/audio_manager.hpp
    src/ducking.hpp
)

# Create plugin library
add_library(openfm MODULE ${SOURCES} ${HEADERS})

target_link_libraries(openfm
    PRIVATE
        OBS::libobs
        Qt6::Core
        Qt6::Widgets
        Qt6::WebEngineWidgets
)

# Set plugin properties
set_target_properties(openfm PROPERTIES
    OUTPUT_NAME "openfm"
    PREFIX ""
)

# Install plugin
if(WIN32)
    install(TARGETS openfm
        RUNTIME DESTINATION obs-plugins/64bit
    )
elseif(APPLE)
    install(TARGETS openfm
        LIBRARY DESTINATION obs-plugins
    )
else()
    install(TARGETS openfm
        LIBRARY DESTINATION lib/obs-plugins
    )
endif()

