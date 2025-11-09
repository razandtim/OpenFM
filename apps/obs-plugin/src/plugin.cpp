#include "plugin.hpp"
#include "dock.hpp"
#include "audio_manager.hpp"
#include <obs-module.h>
#include <obs-frontend-api.h>
#include <util/platform.h>

OBS_DECLARE_MODULE()
OBS_MODULE_USE_DEFAULT_LOCALE(PLUGIN_NAME, "en-US")

MODULE_EXPORT const char *obs_module_description(void)
{
    return "OpenFM • mood-based music for your stream";
}

namespace openfm {

static Plugin *plugin_instance = nullptr;

Plugin::Plugin()
{
}

Plugin::~Plugin()
{
}

bool Plugin::load()
{
    blog(LOG_INFO, "[OpenFM] Plugin loading...");
    
    setup_dock();
    setup_audio_sources();
    
    blog(LOG_INFO, "[OpenFM] Plugin loaded successfully");
    return true;
}

void Plugin::unload()
{
    blog(LOG_INFO, "[OpenFM] Plugin unloading...");
    // Cleanup
}

void Plugin::setup_dock()
{
    // Create dock in Qt main thread
    obs_frontend_push_ui_translation(obs_module_get_string);
    
    auto *dock = new OpenFMDock();
    obs_frontend_add_dock(dock);
    
    obs_frontend_pop_ui_translation();
}

void Plugin::setup_audio_sources()
{
    // Register audio source types
    // TODO: Implement audio source registration
    blog(LOG_INFO, "[OpenFM] Audio sources registered");
}

} // namespace openfm

MODULE_EXPORT bool obs_module_load(void)
{
    openfm::plugin_instance = new openfm::Plugin();
    return openfm::plugin_instance->load();
}

MODULE_EXPORT void obs_module_unload(void)
{
    if (openfm::plugin_instance) {
        openfm::plugin_instance->unload();
        delete openfm::plugin_instance;
        openfm::plugin_instance = nullptr;
    }
}

