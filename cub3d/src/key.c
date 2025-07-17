/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   key.c                                              :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mmacia <marvin@42.fr>                      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/07/23 15:21:14 by mmacia            #+#    #+#             */
/*   Updated: 2024/07/23 15:21:17 by mmacia           ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "../header/cub3d.h"

void	ft_move_forward(t_data *data)
{
	if (data->map[(int)(data->posy)]
			[(int)(data->posx + data->dirx * MOVE_SPEED)] == '0')
		data->posx += data->dirx * MOVE_SPEED;
	if (data->map[(int)
			(data->posy + data->diry * MOVE_SPEED)][(int)(data->posx)] == '0')
		data->posy += data->diry * MOVE_SPEED;
	printf("ft_move_forward called\n");
}

int	ft_key_press(int key, t_data *data)
{
	if (key == XK_Escape)
		ft_free(data);
	else if (key == XK_w)
		ft_move_forward(data);
	else if (key == XK_s)
		ft_move_backward(data);
	else if (key == XK_a)
		ft_move_left(data);
	else if (key == XK_d)
		ft_move_right(data);
	if (key == XK_Right)
		ft_rotate_left(data);
	if (key == XK_Left)
		ft_rotate_right(data);
	return (0);
}
