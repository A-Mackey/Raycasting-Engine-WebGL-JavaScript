
export const TwoPI = 2 * Math.PI;
export const ThreeTwoPI = 3/2 * Math.PI;
export const HalfPI = Math.PI / 2;

// Default colors
export const game_colors = {
    color_white : {r: 1.0, g: 1.0, b: 1.0, a: 1.0},
    color_black : {r: 0.0, g: 0.0, b: 0.0, a: 1.0},
    color_red   : {r: 1.0, g: 0.0, b: 0.0, a: 1.0},
    color_green : {r: 0.0, g: 1.0, b: 0.0, a: 1.0},
    color_blue  : {r: 0.0, g: 0.0, b: 1.0, a: 1.0},
    color_grey  : {r: 0.2, g: 0.2, b: 0.2, a: 1.0},

    game_color_player   : {r: 1.0, g: 1.0, b: 0.0, a: 1.0},
    game_color_lead     : {r: 1.0, g: 1.0, b: 1.0, a: 1.0},

    game_color_minimap_walls    : { r: 1.0,      g: 1.0,     b: 1.0,     a: 1.0 }, // white
    game_color_minimap_walls_x  : { r: 0.999,    g: 0.999,   b: 0.999,   a: 1.0 }, // White
    game_color_minimap_walls_y  : { r: 0.777,    g: 0.777,   b: 0.777,   a: 1.0 }, // Grey  
    game_color_minimap_ground   : { r: 0.2,      g: 0.2,     b: 0.2,     a: 1.0 }, // grey
}
// Players position
export var player_pos               = {x: 2.0, y: 2.0};
export const player_speed           = 0.3;
export function set_player_pos(newPos) {
    player_pos      = {x: newPos.x, y: newPos.y};
}

export var player_collider = {x: 2.0, y: 2.1}
export const player_collider_distance = 0.25;
export function set_player_collider(newPos) {
    player_collider = {x: newPos.x, y: newPos.y};
}

/*
    0   - PI        = Right side
    PI  - 2PI       = Left side

    PI/2 - 3/2 PI   = Up
    else            = Down
*/
export var player_angle             = 0.0;
export const player_rotate_speed    = Math.PI / 10;
export function set_player_angle(newAngle) {
    player_angle    = newAngle;
}

export var ray_count = 200;
export var ray_fov = HalfPI;
export var angle_between_rays = ray_fov / ray_count;
export function set_ray_count(r) 
    {angle_between_rays = ray_fov / ray_count; ray_count = r};
export function set_ray_fov(f)
    {angle_between_rays = ray_fov / ray_count; ray_fov = f};

// 1 - Vertical wall
// 2 - Horizontal wall
export var ray_lengths = [{length: 0, wall: 1}]
export function initialize_ray_lengths(num) {
    ray_lengths = []
    for(var i = 0; i < num; i++) {
        ray_lengths.push({length: 0, wall: 1});
    }
}
export function set_ray_lengths(r) 
    {ray_lengths = r;}
export function modify_ray_lengths(pos, value) {
    ray_lengths[pos] = value;
}

export const floor_gradient_count = 100;
export const floor_gradient_multiplier = floor_gradient_count / 5;

export const game_map = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1],
    [1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
    [1, 0, 0, 0, 1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
    [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
]

export var game_wireframe = false
export var toggle_game_wireframe = () => {game_wireframe = !game_wireframe;}