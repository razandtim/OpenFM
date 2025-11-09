#pragma once

#include <obs.h>
#include <string>
#include <vector>

namespace openfm {

class AudioManager {
public:
    AudioManager();
    ~AudioManager();

    void create_mood_sources();
    void set_active_mood(const std::string &mood);
    void crossfade_to(const std::string &mood, int duration_ms);
    
    void play();
    void pause();
    void set_volume(float volume);
    void set_muted(bool muted);

private:
    obs_source_t *create_media_source(const std::string &name);
    void apply_gain_ramp(obs_source_t *source, float start_gain, float end_gain, int duration_ms);
    
    struct MoodSource {
        std::string name;
        obs_source_t *source;
        bool active;
    };
    
    std::vector<MoodSource> mood_sources_;
    obs_source_t *current_source_;
};

} // namespace openfm

