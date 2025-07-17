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

int	close_window(t_vars *vars)
{
	int	i;

	i = 0;
	mlx_destroy_window(vars->mlx, vars->win);
	mlx_destroy_display(vars->mlx);
	while (vars->img.map[i])
		free(vars->img.map[i++]);
	free(vars->img.map);
	free(vars->mlx);
	exit(0);
}

int	not_in_tab(t_vars *vars, int x, int y)
{
	int	e;

	e = 0;
	while (e <= vars->img.case_nowall)
	{
		if (vars->img.tab[e][0] == x && vars->img.tab[e][1] == y)
			return (0);
		e++;
	}
	if (vars->img.map[y][x] == '1')
		return (0);
	if (vars->img.map[y][x] == 'E')
		vars->img.possible_check++;
	if (vars->img.map[y][x] == 'C')
		vars->img.possible_check++;
	return (1);
}

void	set_tab(t_vars *vars)
{
	int	i;

	i = 0;
	while (i < 400)
	{
		vars->img.tab[i][0] = -1;
		vars->img.tab[i][1] = -1;
		i++;
	}
}

void	game(char *map, t_vars *vars, int fd)
{
	if (!check_map(fd, vars))
	{
		ft_printf("Error\nMAP NON VALIDE\n");
		close (fd);
		exit(0);
	}
	init_game(vars, open(map, O_RDONLY));
	close (fd);
}

int	main(int argc, char **argv)
{
	t_vars	vars;

	if (argc != 2 || ft_strncmp(argv[1] + ft_strlen(argv[1]) - 4, ".ber", 4))
	{
		ft_printf("Error\nFORMAT NON VALIDE\n");
		return (0);
	}
	game(argv[1], &vars, open(argv[1], O_RDONLY));
}
