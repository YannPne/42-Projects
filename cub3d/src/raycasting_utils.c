/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   raycasting_utils.c                                 :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mmacia <marvin@42.fr>                      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/07/23 15:21:14 by mmacia            #+#    #+#             */
/*   Updated: 2024/07/23 15:21:17 by mmacia           ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "../header/cub3d.h"

void	calculate_texture_x(t_render *rd, t_data *data)
{
	double	wallx;

	if (rd->side == 0)
		wallx = data->posy + rd->perp * rd->raydiry;
	else
		wallx = data->posx + rd->perp * rd->raydirx;
	wallx -= floor(wallx);
	rd->texx = (int)(wallx * (double)TEXWIDTH);
	if (rd->side == 0 && rd->raydirx > 0)
		rd->texx = TEXWIDTH - rd->texx - 1;
	if (rd->side == 1 && rd->raydiry < 0)
		rd->texx = TEXWIDTH - rd->texx - 1;
}

void	draw_textured(int x, t_render *rd, t_texture	*t)
{
	int	y;

	y = rd->drawstart - 1;
	while (++y < rd->drawend)
	{
		t->texy = (int)t->texpos & (TEXHEIGHT - 1);
		t->texpos += t->step;
		if (y >= 0 && y < Y && x >= 0 && x < X)
			t->buffer[y * X + x] = t->texture[t->texy * TEXWIDTH + rd->texx];
	}
}

int	create_rgb(int r, int g, int b)
{
	return (r << 16 | g << 8 | b);
}

void	draw_ceiling_and_floor(t_data *d, int h, int x)
{
	int	y;
	int	*buffer;

	y = 0;
	while (y < h / 2)
	{
		buffer = (int *)mlx_get_data_addr(d->image.img,
				&d->image.x, &d->image.y, &d->textures.textures_color.r_f);
		buffer[y * X + x] = create_rgb(d->textures.textures_color.r_c,
				d->textures.textures_color.g_c, d->textures.textures_color.b_c);
		y++;
	}
	y = h / 2;
	while (y < h)
	{
		buffer = (int *)mlx_get_data_addr(d->image.img, &d->image.x,
				&d->image.y, &d->textures.textures_color.r_f);
		buffer[y * X + x] = create_rgb(d->textures.textures_color.r_f,
				d->textures.textures_color.g_f, d->textures.textures_color.b_f);
		y++;
	}
}
