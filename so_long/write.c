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

void	ft_putnbr_itoa(int nb, char *itoa, int *i)
{
	if (nb < 0)
	{
		nb = -nb;
		itoa[*i] = '-';
		*i = *i + 1;
	}
	if (nb > 9)
	{
		ft_putnbr_itoa(nb / 10, itoa, i);
		ft_putnbr_itoa(nb % 10, itoa, i);
	}
	else
	{
		itoa[*i] = nb + '0';
		*i = *i + 1;
	}
}

char	*ft_itoa(int n)
{
	char	*itoa;
	int		n_cpy;
	int		i;

	i = 0;
	n_cpy = n;
	if (n_cpy < 0)
	{
		n_cpy = -n_cpy;
		i++;
	}
	while (n_cpy >= 10)
	{
		i++;
		n_cpy /= 10;
	}
	itoa = malloc((i + 2) * sizeof(char));
	if (itoa == NULL)
		return (NULL);
	i = 0;
	ft_putnbr_itoa(n, itoa, &i);
	itoa[i] = '\0';
	return (itoa);
}

void	finish(t_vars *vars, int win)
{
	int	i;

	i = 0;
	vars->img.nb_move++;
	if (!win)
		ft_printf("count : %d\nLOOSER\n", vars->img.nb_move);
	else
		ft_printf("count : %d\nBIEN JOUER", vars->img.nb_move);
	sleep(1);
	mlx_destroy_window(vars->mlx, vars->win);
	mlx_destroy_display(vars->mlx);
	while (vars->img.map[i])
		free(vars->img.map[i++]);
	free(vars->img.map);
	free(vars->mlx);
	exit(0);
}

void	draw_rectangle(t_vars *vars, int x, int y, int w)
{
	int	i;
	int	j;
	int	color;
	int	h;

	i = x;
	color = 0xFFFFFF;
	h = 18;
	while (i < x + w)
	{
		j = y;
		while (j < y + h)
		{
			mlx_pixel_put(vars->mlx, vars->win, i, j, color);
			j++;
		}
		i++;
	}
}

void	score(t_vars *vars, int c)
{
	char	*count;
	char	*str;

	if (c == XK_Escape)
	{
		mlx_destroy_window(vars->mlx, vars->win);
		mlx_destroy_display(vars->mlx);
		c = 0;
		while (vars->img.map[c])
			free(vars->img.map[c++]);
		free(vars->img.map);
		free(vars->mlx);
		exit(0);
	}
	str = ft_itoa(vars->img.nb_move);
	count = ft_strjoin("count : ", str);
	free(str);
	ft_printf("count : %d\n", vars->img.nb_move);
	draw_rectangle(vars, 12, 7, 70);
	mlx_string_put(vars->mlx, vars->win, 20, 20, 0x000000, count);
	free(count);
	if (vars->img.nb_ennemie == 1)
		move_ennemie(vars, 0, 0);
}
