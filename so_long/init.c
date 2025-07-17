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

void	init_game(t_vars *vars, int fd)
{
	vars->mlx = mlx_init();
	vars->win = mlx_new_window
		(vars->mlx, vars->x * 64, vars->y * 64, "DORA GAME");
	vars->img.map = malloc(sizeof(char *) * (vars->y + 1));
	vars->img.collect = 0;
	vars->img.acollect = 0;
	vars->img.nb_move = 0;
	vars->img.case_nowall = 0;
	vars->img.p = 0;
	vars->img.nb_ennemie = 0;
	set_map(vars, fd);
	if (!check_possible(vars))
	{
		ft_printf("Error\nMAP NON VALIDE\n");
		close (fd);
		exit(0);
	}
	mlx_hook(vars->win, 2, 1L << 0, key_press, vars);
	mlx_hook(vars->win, 17, 0, close_window, vars);
	mlx_loop(vars->mlx);
}

void	set_info_map(t_vars *vars, char c, int i, int e)
{
	if (c == '0')
		vars->img.case_nowall++;
	if (c == 'P')
	{
		vars->img.y_p = i;
		vars->img.x_p = e;
		vars->img.case_nowall++;
	}
	if (c == 'C')
	{
		vars->img.acollect++;
		vars->img.case_nowall++;
	}
	if (c == 'E')
		vars->img.case_nowall++;
	if (c == 'M')
	{
		vars->img.y_e = i;
		vars->img.x_e = e;
		vars->img.nb_ennemie++;
		vars->img.case_nowall++;
	}
}

void	init_map(t_vars *vars, int i, int e, char *ligne)
{
	int	w;
	int	h;

	set_info_map(vars, ligne[e], i, e);
	if (ligne[e] == '1')
		vars->img.img = mlx_xpm_file_to_image(vars->mlx, "m/w.xpm", &w, &h);
	if (ligne[e] == '0')
		vars->img.img = mlx_xpm_file_to_image(vars->mlx, "m/f.xpm", &w, &h);
	if (ligne[e] == 'P')
		vars->img.img = mlx_xpm_file_to_image(vars->mlx, "m/p.xpm", &w, &h);
	if (ligne[e] == 'C')
		vars->img.img = mlx_xpm_file_to_image(vars->mlx, "m/c.xpm", &w, &h);
	if (ligne[e] == 'E')
		vars->img.img = mlx_xpm_file_to_image(vars->mlx, "m/exit.xpm", &w, &h);
	if (ligne[e] == 'M')
		vars->img.img = mlx_xpm_file_to_image(vars->mlx, "m/e.xpm", &w, &h);
}

void	set_map(t_vars *vars, int fd)
{
	char	*ligne;
	int		e;
	int		i;

	i = 0;
	while (i < vars->y)
	{
		vars->img.map[i] = malloc(sizeof(char) * (vars->x + 1));
		ligne = get_next_line(fd);
		e = 0;
		while (e < vars->x)
		{
			vars->img.map[i][e] = ligne[e];
			init_map(vars, i, e, ligne);
			mlx_put_image_to_window
				(vars->mlx, vars->win, vars->img.img, e * 64, i * 64);
			mlx_destroy_image(vars->mlx, vars->img.img);
			vars->img.map[i][e + 1] = '\0';
			e++;
		}
		vars->img.map[i + 1] = '\0';
		i++;
		free(ligne);
	}
	close (fd);
}

int	map_image(t_vars *vars, char *texture, int x, int y)
{
	int	w;
	int	h;

	if (vars->img.p && vars->img.p != 3)
	{
		vars->img.img = mlx_xpm_file_to_image
			(vars->mlx, texture, &w, &h);
		mlx_put_image_to_window(vars->mlx, vars->win, vars->img.img,
			vars->img.x_p * 64, vars->img.y_p * 64);
		mlx_destroy_image(vars->mlx, vars->img.img);
		return (0);
	}
	if (vars->img.map[vars->img.y_e + y][vars->img.x_e + x]
		!= '1' && vars->img.p == 3)
	{
		sprite(vars, x, y, 0);
	}
	if (vars->img.p != 3)
	{
		vars->img.img = mlx_xpm_file_to_image(vars->mlx, texture, &w, &h);
		mlx_put_image_to_window(vars->mlx, vars->win,
			vars->img.img, vars->img.x_e * 64, vars->img.y_e * 64);
		mlx_destroy_image(vars->mlx, vars->img.img);
	}
	return (0);
}
