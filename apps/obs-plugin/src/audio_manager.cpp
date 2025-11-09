#include "audio_manager.hpp"
#include <obs-module.h>

namespace openfm {

AudioManager::AudioManager()
    : current_source_(nullptr)
{
    create_mood_sources();
}

AudioManager::~AudioManager()
{
    // Release all sources
    for (auto &mood : mood_sources_) {
        if (mood.source) {
            obs_source_release(mood.source);
        }
    }
}

void AudioManager::create_mood_sources()
{
    const std::vector<std::string> moods = {
        "epic", "romantic", "funny", "scary", "sad"
    };
    
    for (const auto &mood : moods) {
        std::string source_name = "OpenFM_" + mood;
        obs_source_t *source = create_media_source(source_name);
        
        mood_sources_.push_back({
            mood,
            source,
            false
        });
        
        blog(LOG_INFO, "[OpenFM] Created mood source: %s", source_name.c_str());
    }
}

obs_source_t *AudioManager::create_media_source(const std::string &name)
{
    obs_data_t *settings = obs_data_create();
    obs_data_set_bool(settings, "is_local_file", false);
    obs_data_set_bool(settings, "looping", true);
    obs_data_set_bool(settings, "shuffle", true);
    
    obs_source_t *source = obs_source_create(
        "ffmpeg_source",
        name.c_str(),
        settings,
        nullptr
    );
    
    obs_data_release(settings);
    
    // Make source hidden (controlled by plugin)
    obs_source_set_hidden(source, true);
    
    return source;
}

void AudioManager::set_active_mood(const std::string &mood)
{
    for (auto &m : mood_sources_) {
        if (m.name == mood) {
            m.active = true;
            current_source_ = m.source;
            blog(LOG_INFO, "[OpenFM] Activated mood: %s", mood.c_str());
        } else {
            m.active = false;
        }
    }
}

void AudioManager::crossfade_to(const std::string &mood, int duration_ms)
{
    // Find target mood source
    obs_source_t *target = nullptr;
    for (const auto &m : mood_sources_) {
        if (m.name == mood) {
            target = m.source;
            break;
        }
    }
    
    if (!target) {
        blog(LOG_WARNING, "[OpenFM] Mood not found: %s", mood.c_str());
        return;
    }
    
    // Crossfade from current to target
    if (current_source_ && current_source_ != target) {
        apply_gain_ramp(current_source_, 1.0f, 0.0f, duration_ms);
        apply_gain_ramp(target, 0.0f, 1.0f, duration_ms);
    } else {
        apply_gain_ramp(target, 0.0f, 1.0f, duration_ms);
    }
    
    current_source_ = target;
    set_active_mood(mood);
}

void AudioManager::apply_gain_ramp(obs_source_t *source, float start_gain, float end_gain, int duration_ms)
{
    // TODO: Implement smooth gain ramp using obs_source_set_volume
    // For now, just set the final volume
    obs_source_set_volume(source, end_gain);
}

void AudioManager::play()
{
    if (current_source_) {
        obs_source_media_play_pause(current_source_, false);
    }
}

void AudioManager::pause()
{
    if (current_source_) {
        obs_source_media_play_pause(current_source_, true);
    }
}

void AudioManager::set_volume(float volume)
{
    if (current_source_) {
        obs_source_set_volume(current_source_, volume);
    }
}

void AudioManager::set_muted(bool muted)
{
    if (current_source_) {
        obs_source_set_muted(current_source_, muted);
    }
}

} // namespace openfm

