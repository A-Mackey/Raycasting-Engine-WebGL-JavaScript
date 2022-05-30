import {
    ray_lengths,
    game_colors,
    floor_gradient_count,
    floor_gradient_multiplier
} from '../vars.js'

import { drawRectangle } from '../helpers/draw.js'

export function draw_projection(p1, p2, shader, gl) {
    const width = p2.x - p1.x;
    const height = p1.y - p2.y;

    // Draw Ground
    // drawRectangle({x: p1.x, y: p1.y - height / 2}, p2, game_colors.color_green, shader, gl);
    const floor_bar_height = height / 2 / floor_gradient_count;
    for(var i = 0; i < floor_gradient_count; i++) {
        const current_color = {...game_colors.color_green};

        current_color.r *= floor_gradient_multiplier / (floor_gradient_count - i)
        current_color.g *= floor_gradient_multiplier / (floor_gradient_count - i)
        current_color.b *= floor_gradient_multiplier / (floor_gradient_count - i)

        const bar_p1 = {x: p1.x, y: p1.y - i * floor_bar_height - height / 2};
        const bar_p2 = {x: p2.x, y: p1.y - i * floor_bar_height - floor_bar_height - height / 2};

        drawRectangle(
            bar_p1, 
            bar_p2, 
            current_color, 
            shader, 
            gl
            );
    }

    // Draw Sky
    for(var i = 0; i < floor_gradient_count; i++) {
        const current_color = {...game_colors.color_blue};

        current_color.r *= floor_gradient_multiplier / (i)
        current_color.g *= floor_gradient_multiplier / (i)
        current_color.b *= floor_gradient_multiplier / (i)

        const bar_p1 = {x: p1.x, y: p1.y - i * floor_bar_height};
        const bar_p2 = {x: p2.x, y: p1.y - i * floor_bar_height - floor_bar_height};

        drawRectangle(
            bar_p1, 
            bar_p2, 
            current_color, 
            shader, 
            gl
            );
    }
    const rectangle_width = width / ray_lengths.length;

    // Draw Walls
    for(var i = 0; i < ray_lengths.length; i++) {
        const index = ray_lengths.length - 1 - i;
        const length = ray_lengths[index].length

        const rect_tl = {   x: p1.x + (i * rectangle_width),                       y: 1 / length    };
        const rect_br = {   x: p1.x + (i * rectangle_width) + rectangle_width,     y: 1 / -length   };
        var rect_color = ray_lengths[index].wall == 1 ? {...game_colors.game_color_minimap_walls_x} : {...game_colors.game_color_minimap_walls_y};

        const tint = length <= 0 ? 1.0 : 1 / length * 1.2;

        rect_color.r = rect_color.r * tint
        rect_color.g = rect_color.g * tint
        rect_color.b = rect_color.b * tint

        drawRectangle(
            rect_tl, 
            rect_br,
            rect_color,
            shader,
            gl
            )
    }
}