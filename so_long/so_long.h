/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   so_long.h                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: ypanares <marvin@42.fr>                    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/02/22 19:34:34 by ypanares          #+#    #+#             */
/*   Updated: 2024/02/22 19:35:15 by ypanares         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#ifndef SO_LONG_H

# define SO_LONG_H
# include <stdlib.h>
# include <unistd.h>
# include <stdio.h>
# include "minilibx/mlx.h"
# include <X11/keysym.h>
# include "GNL/get_next_line.h"
# include "ft_printf/ft_printf.h"
# include <math.h>
# include <time.h>

# define WINDOW_WIDTH 800
# define WINDOW_HEIGHT 800

typedef struct s_data
{
	void	*img;
	char	**map;
	int		collect;
	int		acollect;
	int		x_p;
	int		y_p;
	int		x_e;
	int		y_e;
	int		tab[400][2];
	int		possible_check;
	int		case_nowall;
	int		nb_move;
	int		nb_ennemie;
	int		p;
}				t_data;

typedef struct s_info
{
	int		nb_case;
	int		nb_exit;
	int		nb_collect;
	int		nb_ligne;
	int		nb_pd;
}				t_info;

typedef struct s_vars
{
	void	*mlx;
	void	*win;
	int		x;
	int		y;
	t_data	img;
}				t_vars;

void	init_game(t_vars *vars, int fd);
void	set_info_map(t_vars *vars, char c, int i, int e);
void	init_map(t_vars *vars, int i, int e, char *ligne);
void	set_map(t_vars *vars, int fd);
void	sprite(t_vars *vars, int x, int y, int player);
void	game(char *map, t_vars *vars, int fd);
void	ft_putnbr_itoa(int nb, char *itoa, int *i);
void	finish(t_vars *vars, int win);
void	set_tab(t_vars *vars);
void	draw_rectangle(t_vars *vars, int x, int y, int w);
void	score(t_vars *vars, int c);
void	check_possible2(t_vars *vars, int i, int *e);

int		check_map(int fd, t_vars *vars);
int		check_possible(t_vars *vars);
int		ft_strncmp(const char *s1, const char *s2, size_t n);
int		map_image(t_vars *vars, char *texture, int x, int y);
int		move(t_vars *vars, int y, int x);
int		move_ennemie_map(t_vars *vars, int x, int y);
int		move_ennemie(t_vars *vars, int x, int y);
int		key_press(int keycode, t_vars *vars);
int		close_window(t_vars *vars);
int		not_in_tab(t_vars *vars, int x, int y);
int		check_map2(char *ligne, t_info	*info);

char	*ft_itoa(int n);

#endif
