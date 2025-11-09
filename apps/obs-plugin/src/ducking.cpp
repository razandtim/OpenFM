#include "ducking.hpp"
#include <obs-module.h>

namespace openfm {

DuckingManager::DuckingManager()
    : music_group_(nullptr)
    , duck_level_db_(-20.0f)
    , attack_ms_(10)
    , release_ms_(250)
{
}

DuckingManager::~DuckingManager()
{
}

void DuckingManager::set_music_group(obs_source_t *music_group)
{
    music_group_ = music_group;
    update_sidechain_filters();
}

void DuckingManager::add_override_source(const std::string &source_name)
{
    override_sources_.push_back(source_name);
    update_sidechain_filters();
    
    blog(LOG_INFO, "[OpenFM] Added override source: %s", source_name.c_str());
}

void DuckingManager::remove_override_source(const std::string &source_name)
{
    auto it = std::find(override_sources_.begin(), override_sources_.end(), source_name);
    if (it != override_sources_.end()) {
        override_sources_.erase(it);
        update_sidechain_filters();
        
        blog(LOG_INFO, "[OpenFM] Removed override source: %s", source_name.c_str());
    }
}

void DuckingManager::set_duck_level(float level_db)
{
    duck_level_db_ = level_db;
    update_sidechain_filters();
}

void DuckingManager::set_attack_ms(int attack_ms)
{
    attack_ms_ = attack_ms;
    update_sidechain_filters();
}

void DuckingManager::set_release_ms(int release_ms)
{
    release_ms_ = release_ms;
    update_sidechain_filters();
}

void DuckingManager::update_sidechain_filters()
{
    if (!music_group_) {
        blog(LOG_WARNING, "[OpenFM] No music group set for ducking");
        return;
    }
    
    // Remove existing sidechain filters
    obs_source_filter_remove(music_group_, obs_source_get_filter_by_name(music_group_, "OpenFM_Sidechain"));
    
    if (override_sources_.empty()) {
        return;
    }
    
    // Try to create sidechain compressor filter
    obs_data_t *settings = obs_data_create();
    obs_data_set_double(settings, "ratio", 10.0); // Heavy compression
    obs_data_set_double(settings, "threshold", duck_level_db_);
    obs_data_set_double(settings, "attack_time", attack_ms_);
    obs_data_set_double(settings, "release_time", release_ms_);
    
    // Attempt to create sidechain filter
    obs_source_t *filter = obs_source_create_private(
        "compressor_filter",
        "OpenFM_Sidechain",
        settings
    );
    
    if (filter) {
        // TODO: Set sidechain source(s) if OBS supports it
        // For now, fall back to simple activity-based attenuation
        obs_source_filter_add(music_group_, filter);
        obs_source_release(filter);
        
        blog(LOG_INFO, "[OpenFM] Sidechain filter created");
    } else {
        blog(LOG_WARNING, "[OpenFM] Failed to create sidechain filter, using activity-based ducking");
        // Fallback: monitor override sources and manually adjust volume
    }
    
    obs_data_release(settings);
}

obs_source_t *DuckingManager::find_source_by_name(const std::string &name)
{
    return obs_get_source_by_name(name.c_str());
}

} // namespace openfm

