/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   parse3.c                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mmacia <marvin@42.fr>                      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/07/23 15:21:14 by mmacia            #+#    #+#             */
/*   Updated: 2024/07/23 15:21:17 by mmacia           ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */
#include "../header/cub3d.h"

int	ft_texture_xmp(char *line, char **texture, t_data *data)
{
	int	fd;

	while (*(line + 2) == ' ' || *(line + 2) == '\t')
		line++;
	fd = open(line + 2, O_RDONLY);
	if (fd < 0)
	{
		printf("Le fichier %s n'existe pas.\n", line + 2);
		close(fd);
		ft_free(data);
	}
	*texture = ft_strdup(line + 2);
	if (!*texture)
	{
		printf("Error: Memory allocation failed\n");
		ft_free(data);
		return (0);
	}
	return (1);
}

int	ft_set_texture(char *line, t_data *data)
{
	if (ft_strncmp(line, "NO", 2) == 0)
		return (ft_texture_xmp(line, &data->textures.north, data));
	else if (ft_strncmp(line, "SO", 2) == 0)
		return (ft_texture_xmp(line, &data->textures.south, data));
	else if (ft_strncmp(line, "WE", 2) == 0)
		return (ft_texture_xmp(line, &data->textures.west, data));
	else if (ft_strncmp(line, "EA", 2) == 0)
		return (ft_texture_xmp(line, &data->textures.east, data));
	return (1);
}

int	ft_check_map_direction(int fd, t_data *data, int elements_found)
{
	t_map	m;

	m.line = get_next_line(fd);
	while (m.line && ++elements_found < 6)
	{
		if (ft_check_map_direction2(data, &m))
			return (0);
		m.line[ft_strlen(m.line) - 1] = '\0';
		if (!ft_set_texture(m.line, data))
			return (0);
		free(m.line);
		m.line = get_next_line(fd);
	}
	free(m.line);
	close(fd);
	if (elements_found < 6)
		return (printf("Error: Missing some textures or color\n"), 0);
	return (1);
}
