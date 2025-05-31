/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   solong.c                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: ypanares <marvin@42.fr>                    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/12/22 18:46:39 by ypanares          #+#    #+#             */
/*   Updated: 2023/12/22 18:47:47 by ypanares         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "so_long.h"

int	move(t_vars *vars, int y, int x)
{
	if (vars->img.map[vars->img.y_p + y][vars->img.x_p + x] == '1')
		return (0);
	if (vars->img.nb_ennemie == 1 && vars->img.y_p + y == vars->img.y_e
		&& vars->img.x_p + x == vars->img.x_e)
		finish(vars, 0);
	sprite(vars, x, y, 1);
	if (vars->img.map[vars->img.y_p + y][vars->img.x_p + x] == 'E')
		if (vars->img.collect == vars->img.acollect)
			finish(vars, 1);
	if (vars->img.map[vars->img.y_p + y][vars->img.x_p + x] == 'C')
	{
		vars->img.collect++;
		vars->img.map[vars->img.y_p + y][vars->img.x_p + x] = '0';
	}
	vars->img.p = 1;
	if (vars->img.map[vars->img.y_p][vars->img.x_p] == 'E')
		map_image(vars, "m/exit.xpm", 0, 0);
	else
		map_image(vars, "m/f.xpm", 0, 0);
	vars->img.p = 0;
	return (1);
}

int	move_ennemie_map(t_vars *vars, int x, int y)
{
	if (vars->img.map[vars->img.y_e + y][vars->img.x_e + x] != '1')
	{
		vars->img.p = 3;
		map_image(vars, "m/e.xpm", x, y);
		vars->img.p = 0;
		if (vars->img.map[vars->img.y_e][vars->img.x_e] == 'C')
			map_image(vars, "m/c.xpm", 0, 0);
		if (vars->img.map[vars->img.y_e][vars->img.x_e] == 'E')
			map_image(vars, "m/exit.xpm", 0, 0);
		vars->img.x_e += x;
		vars->img.y_e += y;
		return (1);
	}
	return (0);
}

int	move_ennemie(t_vars *vars, int x, int y)
{
	int	random;

	srand(time(NULL));
	while (1)
	{
		x = 0;
		y = 0;
		random = (rand() % 4) + 1;
		if (random == 1)
			x = 1;
		if (random == 2)
			x = -1;
		if (random == 3)
			y = 1;
		if (random == 4)
			y = -1;
		if (vars->img.x_e + x == vars->img.x_p
			&& vars->img.y_e + y == vars->img.y_p)
			finish(vars, 0);
		else if (vars->img.map[vars->img.y_e][vars->img.x_e] != 'C')
			map_image(vars, "m/f.xpm", 0, 0);
		if (move_ennemie_map(vars, x, y))
			return (0);
	}
}

void	sprite(t_vars *vars, int x, int y, int player)
{
	int	i;
	int	w;
	int	h;

	i = 0;
	while (++i < 640)
	{
		if (++i > 600)
			vars->img.img = mlx_xpm_file_to_image(vars->mlx, "m/p.xpm", &w, &h);
		else
			vars->img.img = mlx_xpm_file_to_image(vars->mlx, "m/d.xpm", &w, &h);
		if (player)
			mlx_put_image_to_window(vars->mlx, vars->win, vars->img.img,
				vars->img.x_p * 64 + (x * i / 10), vars->img.y_p
				* 64 + (y * i / 10));
		else
		{
			mlx_destroy_image(vars->mlx, vars->img.img);
			vars->img.img = mlx_xpm_file_to_image(vars->mlx, "m/e.xpm", &w, &h);
			mlx_put_image_to_window(vars->mlx, vars->win, vars->img.img,
				vars->img.x_e * 64 + (x * i / 10), vars->img.y_e
				* 64 + (y * i / 10));
		}
		mlx_destroy_image(vars->mlx, vars->img.img);
	}
}

int	key_press(int keycode, t_vars *vars)
{
	if (keycode == XK_Escape || (keycode == 'd' && move(vars, 0, 1)))
	{
		vars->img.x_p++;
		vars->img.nb_move++;
		score(vars, keycode);
	}
	else if (keycode == 'a' && move(vars, 0, -1))
	{
		vars->img.x_p--;
		vars->img.nb_move++;
		score(vars, keycode);
	}
	else if (keycode == 's' && move(vars, 1, 0))
	{
		vars->img.y_p++;
		vars->img.nb_move++;
		score(vars, keycode);
	}
	else if (keycode == 'w' && move(vars, -1, 0))
	{
		vars->img.y_p--;
		vars->img.nb_move++;
		score(vars, keycode);
	}
	return (0);
}
