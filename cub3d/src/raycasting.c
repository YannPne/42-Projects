/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   raycasting.c                                       :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mmacia <marvin@42.fr>                      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/07/23 15:21:14 by mmacia            #+#    #+#             */
/*   Updated: 2024/07/23 15:21:17 by mmacia           ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "../header/cub3d.h"

void	draw_textured_line(t_data *data, int x, t_render *rd)
{
	t_texture		t;

	t.step = 1.0 * TEXHEIGHT / rd->lineheight;
	t.texpos = (rd->drawstart - Y / 2 + rd->lineheight / 2) * t.step;
	t.buffer = (int *)mlx_get_data_addr(data->image.img, &data->image.x,
			&data->image.y, &data->textures.textures_color.r_f);
	if (rd->side == 0 && rd->stepx > 0)
		t.texture = (int *)mlx_get_data_addr(data->textures.east_final.img,
				&data->textures.east_final.x, &data->textures.east_final.y,
				&data->textures.textures_color.r_f);
	else if (rd->side == 0 && rd->stepx < 0)
		t.texture = (int *)mlx_get_data_addr(data->textures.west_final.img,
				&data->textures.west_final.x, &data->textures.west_final.y,
				&data->textures.textures_color.r_f);
	else if (rd->side == 1 && rd->stepy > 0)
		t.texture = (int *)mlx_get_data_addr(data->textures.south_final.img,
				&data->textures.south_final.x, &data->textures.south_final.y,
				&data->textures.textures_color.r_f);
	else
		t.texture = (int *)mlx_get_data_addr(data->textures.north_final.img,
				&data->textures.north_final.x, &data->textures.north_final.y,
				&data->textures.textures_color.r_f);
	draw_textured(x, rd, &t);
}

void	ft_initrender(t_render *render, t_data *data, int x, int w)
{
	render->camerax = 2 * x / (double)w - 1;
	render->raydirx = data->dirx + data->planex * render->camerax;
	render->raydiry = data->diry + data->planey * render->camerax;
	render->mapx = (int)data->posx;
	render->mapy = (int)data->posy;
	if (render->raydirx == 0)
		render->deltadistx = 1e30;
	else
		render->deltadistx = fabs(1 / render->raydirx);
	render->deltadisty = fabs(1 / render->raydiry);
	if (render->raydiry == 0)
		render->deltadisty = 1e30;
	render->stepx = 1;
	if (render->raydirx < 0)
		render->stepx = -1;
	render->stepy = 1;
	if (render->raydiry < 0)
		render->stepy = -1;
	render->hit = 0;
	render->sidedistx = (render->mapx + 1.0 - data->posx) * render->deltadistx;
	if (render->raydirx < 0)
		render->sidedistx = (data->posx - render->mapx) * render->deltadistx;
	render->sidedisty = (render->mapy + 1.0 - data->posy) * render->deltadisty;
	if (render->raydiry < 0)
		render->sidedisty = (data->posy - render->mapy) * render->deltadisty;
}

void	ft_rendercheck(t_render *render, t_data *data)
{
	while (render->hit == 0)
	{
		if (render->sidedistx < render->sidedisty)
		{
			render->sidedistx += render->deltadistx;
			render->mapx += render->stepx;
			render->side = 0;
		}
		else
		{
			render->sidedisty += render->deltadisty;
			render->mapy += render->stepy;
			render->side = 1;
		}
		if (render->mapx < 0 || render->mapx >= data->map_width
			|| render->mapy < 0 || render->mapy >= data->map_height)
		{
			render->hit = 1;
			return ;
		}
		if (data->map[render->mapy][render->mapx] == '1')
			render->hit = 1;
	}
}

void	ft_setrender(t_render *rd, t_data *data, int h)
{
	if (rd->side == 0)
		rd->perp = (rd->mapx - data->posx + (1 - rd->stepx) / 2) / rd->raydirx;
	else
		rd->perp = (rd->mapy - data->posy + (1 - rd->stepy) / 2) / rd->raydiry;
	rd->lineheight = (int)(h / rd->perp);
	rd->drawstart = -rd->lineheight / 2 + h / 2;
	if (rd->drawstart < 0)
		rd->drawstart = 0;
	rd->drawend = rd->lineheight / 2 + h / 2;
	if (rd->drawend >= h)
		rd->drawend = h - 1;
	if (rd->side == 0)
	{
		if (rd->stepx > 0)
			rd->color = 3;
		else
			rd->color = create_rgb(0, 255, 0);
	}
	else
	{
		if (rd->stepy > 0)
			rd->color = create_rgb(0, 0, 255);
		else
			rd->color = create_rgb(255, 255, 0);
	}
}

int	ft_render(t_data *data)
{
	t_render	rd;
	int			x;

	x = 0;
	if (data->image.img)
		mlx_destroy_image(data->mlx_ptr, data->image.img);
	data->image.img = mlx_new_image(data->mlx_ptr, X, Y);
	if (!data->image.img)
		return (1);
	while (x < X)
	{
		draw_ceiling_and_floor(data, Y, x);
		ft_initrender(&rd, data, x, X);
		ft_rendercheck(&rd, data);
		ft_setrender(&rd, data, Y);
		calculate_texture_x(&rd, data);
		draw_textured_line(data, x, &rd);
		x++;
	}
	mlx_put_image_to_window(data->mlx_ptr,
		data->win_ptr, data->image.img, 0, 0);
	return (0);
}
