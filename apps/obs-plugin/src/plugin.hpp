#pragma once

#include <obs-module.h>
#include <obs-frontend-api.h>

#define PLUGIN_NAME "openfm"
#define PLUGIN_VERSION "0.1.0"

namespace openfm {

class Plugin {
public:
    Plugin();
    ~Plugin();

    bool load();
    void unload();

private:
    void setup_dock();
    void setup_audio_sources();
};

} // namespace openfm

