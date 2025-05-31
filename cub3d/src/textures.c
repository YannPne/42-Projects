/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   textures.c                                         :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mmacia <marvin@42.fr>                      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/07/23 15:21:14 by mmacia            #+#    #+#             */
/*   Updated: 2024/07/23 15:21:17 by mmacia           ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "../header/cub3d.h"

int	ft_load_textures(t_data *data)
{
	data->textures.north_final.img = mlx_xpm_file_to_image(data->mlx_ptr,
			data->textures.north,
			&data->textures.north_final.x, &data->textures.north_final.y);
	data->textures.south_final.img = mlx_xpm_file_to_image(data->mlx_ptr,
			data->textures.south,
			&data->textures.south_final.x, &data->textures.south_final.y);
	data->textures.west_final.img = mlx_xpm_file_to_image(data->mlx_ptr,
			data->textures.west,
			&data->textures.west_final.x, &data->textures.west_final.y);
	data->textures.east_final.img = mlx_xpm_file_to_image(data->mlx_ptr,
			data->textures.east,
			&data->textures.east_final.x, &data->textures.east_final.y);
	return (1);
}
