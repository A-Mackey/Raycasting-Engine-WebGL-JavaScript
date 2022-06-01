import {
	TwoPI,
	ThreeTwoPI,
	HalfPI,
	game_map, 
	game_colors, 
	player_pos, 
	player_collider_distance, 
	set_player_collider,
	player_angle,
	ray_count,
	ray_fov,
	angle_between_rays,
	ray_lengths,
	modify_ray_lengths
} from '../vars.js'

const cell_buffer = 0.00025;
const player_buffer = 0.01;
const lead_buffer = 0.005;

var player_pos_screen = {x: 0, y: 0};

import { drawRectangle, drawLine } from '../helpers/draw.js';

function map_to_screen(topLeft, bottomRight, pos) {
	const width     = bottomRight.x - topLeft.x;
	const height    = topLeft.y - bottomRight.y;

	return {
		x: topLeft.x + (width / game_map[0].length) * pos.x, 
		y: topLeft.y - (height / game_map.length) * pos.y
	};
}

export function draw_minimap(p1, p2, shader, gl) {
	drawRectangle(p1, p2, game_colors.color_black, shader, gl)
	const top_left_x        = p1.x;
	const top_left_y        = p1.y;
	const bottom_right_x    = p2.x;
	const bottom_right_y    = p2.y;

	const width             = bottom_right_x - top_left_x;
	const height            = top_left_y - bottom_right_y;

	const cell_x_count      = game_map[0].length;
	const cell_y_count      = game_map.length;

	const cell_width        = width / cell_x_count;
	const cell_height       = height / cell_y_count;

	// Draw the grid
	for(var i = 0; i < cell_y_count; i++) {
		for(var o = 0; o < cell_x_count; o++) {
			// Top left of the cell
			const cell_p1 = {
				x: top_left_x + (o * cell_width), 
				y: top_left_y - (i * cell_height)
			};
			// Bottom right of the cell
			const cell_p2 = {
				x: top_left_x + (o * cell_width) + cell_width - cell_buffer, 
				y: top_left_y - (i * cell_height) - cell_height + cell_buffer
			};

			// Default color
			var color = game_colors.color_white;

			// Colors for different cell types
			switch (game_map[i][o]) {
				case 0:
					color = game_colors.game_color_minimap_ground;
					break;
				case 1:
					color = game_colors.game_color_minimap_walls;
					break;
				default:
				  return;
			  }
			//   Draw cell
			drawRectangle(cell_p1, cell_p2, color, shader, gl)
		}
	}

	draw_rays(p1, p2, shader, gl);
	draw_player(p1, p2, shader, gl);
}

// Draws the player on the minimap
function draw_player(p1, p2, shader, gl) {
	// Draw player
	player_pos_screen = map_to_screen(p1, p2, player_pos);
	const player_pos_screen_1 = {x: player_pos_screen.x + player_buffer, y: player_pos_screen.y + player_buffer};
	const player_pos_screen_2 = {x: player_pos_screen.x - player_buffer, y: player_pos_screen.y - player_buffer};

	const player_collider = {
		x: player_pos.x + player_collider_distance * Math.sin(player_angle),
		y: player_pos.y + player_collider_distance * Math.cos(player_angle)
	};
	set_player_collider(player_collider);

	const lead_point = map_to_screen(p1, p2, player_collider);
	const lead_point_1 = {x: lead_point.x - lead_buffer, y: lead_point.y - lead_buffer};
	const lead_point_2 = {x: lead_point.x + lead_buffer, y: lead_point.y + lead_buffer};

	//console.log(player_pos_screen)

	drawRectangle(player_pos_screen_1, player_pos_screen_2, game_colors.game_color_player, shader, gl);
	drawRectangle(lead_point_1, lead_point_2, game_colors.game_color_lead, shader, gl);
}

// Draws the rays from the player to the walls
function draw_rays(p1, p2, shader, gl) {
	const width = p2.x - p1.x;
	const height = p1.y - p2.y;

	for(var i = 0; i <= ray_count; i++) {
		var angle = player_angle - (ray_fov / 2) + (angle_between_rays * i);

		if(angle < 0) {angle += TwoPI;}
		else if(angle > TwoPI) {angle -= TwoPI;}

		var ray_dir = {x: true}
		const length = calculate_ray_distance(player_pos.x, player_pos.y, angle, ray_dir)

		const is_x = ray_dir.x

		// If wall is vertical, make green, else make red
		var ray_color = is_x ? game_colors.game_color_minimap_walls_x : game_colors.game_color_minimap_walls_y;

		modify_ray_lengths(i, {length: length, wall: is_x ? 1 : 2});

		const ray = {
			x: player_pos.x + length * Math.sin(angle),
			y: player_pos.y + length * Math.cos(angle)
		}

		const ray_to_screen = map_to_screen(p1, p2, ray);

		drawLine(player_pos_screen, ray_to_screen, ray_color, shader, gl);
	}

	// console.log(ray_lengths)
}

// x - Red
// y - Green
function calculate_ray_distance(pos_x, pos_y, angle, ray) {
	// if(angle < HalfPI || angle > Math.PI) {return 0;}
	const x = calculate_ray_distance_x(pos_x, pos_y, angle);
	const y = calculate_ray_distance_y(pos_x, pos_y, angle);

	// return y;

	if(x <= -1) {   ray.x = false; return y;   }
	if(y <= -1) {   ray.x = true;  return x;   }

	if(x < y)   {   ray.x = true;  return x;   }
	else        {   ray.x = false; return y;   }
}

/*
	0 - Stright down
	PI/2 - Stright right

	0   - PI        = Right side
	PI  - 2PI       = Left side

	PI/2 - 3/2 PI   = Up
	else            = Down
*/

function calculate_ray_distance_x(pos_x, pos_y, angle) {
	const cell_x = pos_x | 0
	const cell_y = pos_y | 0
	
	// Check right
	if(angle > 0 && angle < Math.PI) {
		const angle_on_x = Math.abs(angle - HalfPI);
		for(var i = cell_x + 1; i < game_map[0].length; i++) {
			const x_dist = i - pos_x;

			// cos
			var length = x_dist / Math.cos(angle_on_x);

			// aa + bb = cc
			// cc - aa = bb
			const y_dist = Math.sqrt(length * length - x_dist * x_dist)
			var cell_y_n = pos_y;
			if(angle > HalfPI) {cell_y_n -= y_dist;} else {cell_y_n += y_dist;}
			if(cell_y_n >= game_map.length || cell_y_n < 0) {break;}
			cell_y_n = cell_y_n | 0

			if(game_map[cell_y_n][i] == 1) {return length;}
		}
	}

	// Check Left
	if(angle < TwoPI && angle > Math.PI) {
		const angle_on_x = Math.abs(angle  - ThreeTwoPI)
		for(var i = cell_x; i > 0; i--) {
			const x_dist = pos_x - i;
			// cos
			var length = x_dist / Math.cos(angle_on_x);

			// aa + bb = cc
			// cc - aa = bb
			const y_dist = Math.sqrt(length * length - x_dist * x_dist)
			var cell_y_n = pos_y;
			if(angle < ThreeTwoPI) {cell_y_n -= y_dist;} else {cell_y_n += y_dist;}
			if(cell_y_n >= game_map.length || cell_y_n < 0) {break;}
			cell_y_n = cell_y_n | 0

			if(game_map[cell_y_n][i - 1] == 1) {return length;}
		}
	}

	return -1;
}

function calculate_ray_distance_y(pos_x, pos_y, angle) {
	const cell_x = pos_x | 0
	const cell_y = pos_y | 0
	
	// Check up
	if(angle > Math.PI / 2 && angle < ThreeTwoPI) {
		const angle_on_y = Math.abs(angle - Math.PI);
		for(var i = cell_y; i > 0; i--) {
			const y_dist = pos_y - i;
			// cos
			var length = y_dist / Math.cos(angle_on_y);

			const x_dist = Math.sqrt(length * length - y_dist * y_dist)
			var cell_x_n = pos_x;
			if(angle > Math.PI) {cell_x_n -= x_dist;} else {cell_x_n += x_dist;}
			if(cell_x_n >= game_map[0].length || cell_x_n < 0) {break;}
			cell_x_n = cell_x_n | 0

			if(game_map[i - 1][cell_x_n] == 1) {return length;}
		}
	}

	// Check down
	if(angle > ThreeTwoPI || angle < HalfPI) {
		const angle_on_y = angle > ThreeTwoPI ? angle - TwoPI : angle;
		for(var i = cell_y + 1; i < game_map.length; i++) {
			const y_dist = i - pos_y;
			// cos
			var length = y_dist / Math.cos(angle_on_y);

			const x_dist = Math.sqrt(length * length - y_dist * y_dist)
			var cell_x_n = pos_x;
			if(angle_on_y < 0) {cell_x_n -= x_dist;} else {cell_x_n += x_dist;}
			if(cell_x_n >= game_map[0].length || cell_x_n < 0) {break;}
			cell_x_n = cell_x_n | 0

			if(game_map[i][cell_x_n] == 1) {return length;}
		}
	}

	return -1;
}