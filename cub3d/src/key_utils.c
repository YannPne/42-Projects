/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   key_utils.c                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mmacia <marvin@42.fr>                      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/07/23 15:21:14 by mmacia            #+#    #+#             */
/*   Updated: 2024/07/23 15:21:17 by mmacia           ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "../header/cub3d.h"

void	ft_move_backward(t_data *data)
{
	if (data->map[(int)(data->posy)]
			[(int)(data->posx - data->dirx * MOVE_SPEED)] == '0')
		data->posx -= data->dirx * MOVE_SPEED;
	if (data->map[(int)
			(data->posy - data->diry * MOVE_SPEED)][(int)(data->posx)] == '0')
		data->posy -= data->diry * MOVE_SPEED;
	printf("ft_move_backward called\n");
}

void	ft_move_left(t_data *data)
{
	if (data->map[(int)(data->posy)]
			[(int)(data->posx - data->planex * MOVE_SPEED)] == '0')
		data->posx -= data->planex * MOVE_SPEED;
	if (data->map[(int)
			(data->posy - data->planey * MOVE_SPEED)][(int)(data->posx)] == '0')
		data->posy -= data->planey * MOVE_SPEED;
	printf("ft_move_left called\n");
}

void	ft_move_right(t_data *data)
{
	if (data->map[(int)(data->posy)]
			[(int)(data->posx + data->planex * MOVE_SPEED)] == '0')
		data->posx += data->planex * MOVE_SPEED;
	if (data->map[(int)
			(data->posy + data->planey * MOVE_SPEED)][(int)(data->posx)] == '0')
		data->posy += data->planey * MOVE_SPEED;
	printf("ft_move_right called\n");
}

void	ft_rotate_left(t_data *data)
{
	double	olddirx;
	double	oldplanex;

	olddirx = data->dirx;
	oldplanex = data->planex;
	data->dirx = data->dirx * cos
		(ROTATION_SPEED) - data->diry * sin(ROTATION_SPEED);
	data->diry = olddirx * sin
		(ROTATION_SPEED) + data->diry * cos(ROTATION_SPEED);
	data->planex = data->planex * cos
		(ROTATION_SPEED) - data->planey * sin(ROTATION_SPEED);
	data->planey = oldplanex * sin
		(ROTATION_SPEED) + data->planey * cos(ROTATION_SPEED);
}

void	ft_rotate_right(t_data *data)
{
	double	olddirx;
	double	oldplanex;

	olddirx = data->dirx;
	oldplanex = data->planex;
	data->dirx = data->dirx * cos
		(-ROTATION_SPEED) - data->diry * sin(-ROTATION_SPEED);
	data->diry = olddirx * sin
		(-ROTATION_SPEED) + data->diry * cos(-ROTATION_SPEED);
	data->planex = data->planex * cos
		(-ROTATION_SPEED) - data->planey * sin(-ROTATION_SPEED);
	data->planey = oldplanex * sin
		(-ROTATION_SPEED) + data->planey * cos(-ROTATION_SPEED);
}
