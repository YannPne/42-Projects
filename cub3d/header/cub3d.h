/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   cub3d.h                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mmacia <marvin@42.fr>                      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/07/23 15:21:14 by mmacia            #+#    #+#             */
/*   Updated: 2024/07/23 15:21:17 by mmacia           ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */
#ifndef CUB3D_H
# define CUB3D_H

# define X 1200
# define Y 800
# define ROTATION_SPEED 0.05
# define MOVE_SPEED 0.2
# define TEXWIDTH 64
# define TEXHEIGHT 64

# include "../libs/minilibx-linux/mlx.h"
# include "../libs/libft/libft.h"
# include "../libs/get_next_line/get_next_line.h"

# include <X11/Xlib.h>
# include <X11/keysym.h>
# include <unistd.h>
# include <stdio.h>
# include <fcntl.h>
# include <math.h>

typedef struct s_map
{
	char	*line;
	char	**rgb;
	int		g;
	int		b;
	int		r;
}	t_map;

typedef struct s_texture
{
	int		texy;
	double	step;
	double	texpos;
	int		*buffer;
	int		*texture;
}	t_texture;

typedef struct s_images
{
	int		x;
	int		y;
	void	*img;
}	t_images;

typedef struct s_render
{
	double	camerax;
	double	raydirx;
	double	raydiry;
	int		mapx;
	int		mapy;
	double	sidedistx;
	double	sidedisty;
	double	deltadistx;
	double	deltadisty;
	double	perp;
	int		stepx;
	int		stepy;
	int		hit;
	int		texx;
	int		side;
	int		lineheight;
	int		drawstart;
	int		drawend;
	int		color;
}	t_render;

typedef struct s_textures_color
{
	int	r_f;
	int	g_f;
	int	b_f;
	int	r_c;
	int	g_c;
	int	b_c;
}	t_textures_color;

typedef struct s_textures
{
	char				*north;
	char				*south;
	char				*west;
	char				*east;
	t_images			north_final;
	t_images			south_final;
	t_images			west_final;
	t_images			east_final;
	t_textures_color	textures_color;
}	t_textures;

typedef struct s_data
{
	void		*mlx_ptr;
	void		*win_ptr;
	char		**map;
	int			map_width;
	int			map_height;
	t_textures	textures;
	t_images	image;
	double		posx;
	double		posy;
	double		dirx;
	double		diry;
	double		planex;
	double		planey;
}	t_data;

void	ft_init(t_data *data, char *input, int i, int j);
void	ft_free(t_data *data);
int		ft_wrapper_free(t_data *data);
int		ft_key_press(int key, t_data *data);
void	ft_close(void);
int		ft_get_map_dimensions(char *file, t_data *data, int map_ok, int len);
int		create_rgb(int r, int g, int b);
int		ft_render(t_data *data);
int		ft_parse_map(char *filename, t_data *data, int player_pos_ok);
int		ft_load_textures(t_data *data);
void	ft_move_forward(t_data *data);
void	ft_move_backward(t_data *data);
void	ft_move_left(t_data *data);
void	ft_move_right(t_data *data);
void	ft_rotate_left(t_data *data);
void	ft_rotate_right(t_data *data);
void	draw_ceiling_and_floor(t_data *d, int h, int x);
void	draw_textured(int x, t_render *rd, t_texture	*t);
void	calculate_texture_x(t_render *rd, t_data *data);
int		ft_check_map_direction2(t_data *data, t_map *m);
int		ft_check_map_direction(int fd, t_data *data, int elements_found);
int		check_map_char(char c);

#endif