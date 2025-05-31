/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   exit.c                                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mmacia <marvin@42.fr>                      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/07/23 15:21:14 by mmacia            #+#    #+#             */
/*   Updated: 2024/07/23 15:21:17 by mmacia           ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "../header/cub3d.h"

void	ft_close(void)
{
	exit(0);
}

int	ft_wrapper_free(t_data *data)
{
	ft_free(data);
	return (0);
}

void	ft_destroy_mlx_image(t_data *data)
{
	int	i;

	i = 0;
	if (data->textures.north_final.img)
		mlx_destroy_image(data->mlx_ptr, data->textures.north_final.img);
	if (data->textures.south_final.img)
		mlx_destroy_image(data->mlx_ptr, data->textures.south_final.img);
	if (data->textures.west_final.img)
		mlx_destroy_image(data->mlx_ptr, data->textures.west_final.img);
	if (data->textures.east_final.img)
		mlx_destroy_image(data->mlx_ptr, data->textures.east_final.img);
	if (data->map)
	{
		while (data->map[i])
			free(data->map[i++]);
		free(data->map);
		data->map = NULL;
	}
}

void	ft_free(t_data *data)
{
	if (data->image.img && data->mlx_ptr)
		mlx_destroy_image(data->mlx_ptr, data->image.img);
	if (data->image.img && data->mlx_ptr)
		ft_destroy_mlx_image(data);
	if (data->textures.north)
		free(data->textures.north);
	if (data->textures.south)
		free(data->textures.south);
	if (data->textures.west)
		free(data->textures.west);
	if (data->textures.east)
		free(data->textures.east);
	if (data->mlx_ptr && data->win_ptr)
		mlx_destroy_window(data->mlx_ptr, data->win_ptr);
	if (data->mlx_ptr)
	{
		mlx_destroy_display(data->mlx_ptr);
		free(data->mlx_ptr);
	}
	ft_close();
}
