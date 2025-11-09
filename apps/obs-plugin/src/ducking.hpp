#pragma once

#include <obs.h>
#include <string>
#include <vector>

namespace openfm {

class DuckingManager {
public:
    DuckingManager();
    ~DuckingManager();

    void set_music_group(obs_source_t *music_group);
    void add_override_source(const std::string &source_name);
    void remove_override_source(const std::string &source_name);
    void set_duck_level(float level_db);
    void set_attack_ms(int attack_ms);
    void set_release_ms(int release_ms);

private:
    void update_sidechain_filters();
    obs_source_t *find_source_by_name(const std::string &name);
    
    obs_source_t *music_group_;
    std::vector<std::string> override_sources_;
    float duck_level_db_;
    int attack_ms_;
    int release_ms_;
};

} // namespace openfm

