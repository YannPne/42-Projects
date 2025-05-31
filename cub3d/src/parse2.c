/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   parse2.c                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mmacia <marvin@42.fr>                      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/07/23 15:21:14 by mmacia            #+#    #+#             */
/*   Updated: 2024/07/23 15:21:17 by mmacia           ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */
#include "../header/cub3d.h"

void	ft_free_split(char **split)
{
	int	i;

	i = 0;
	if (!split)
		return ;
	while (split[i])
	{
		free(split[i]);
		i++;
	}
	free(split);
}

int	check_map_char(char c)
{
	if (c == '1' || c == '0' || c == 'E' || c == ' '
		|| c == 'S' || c == 'N' || c == 'W' || c == '\n')
		return (1);
	else
		return (0);
}

int	check_map_is_ok(int map_ok)
{
	if (!map_ok)
		return (printf("Error: No map found in the file\n"), 0);
	return (1);
}

int	ft_get_map_dimensions(char *file, t_data *data, int map_ok, int len)
{
	char	*line;
	int		fd;

	fd = open(file, O_RDONLY);
	map_ok = 0;
	line = get_next_line(fd);
	while (line)
	{
		if (line)
		{
			if (!map_ok && (line[0] == '1' || line[0] == '0'))
				map_ok = 1;
			if (map_ok)
			{
				len = ft_strlen(line);
				if (len > data->map_width)
					data->map_width = len;
				data->map_height++;
			}
		}
		free(line);
		line = get_next_line(fd);
	}
	close(fd);
	return (check_map_is_ok(map_ok));
}

int	ft_check_map_direction2(t_data *data, t_map *m)
{
	if (ft_strncmp(m->line, "F ", 2) == 0 || ft_strncmp(m->line, "C ", 2) == 0)
	{
		m->rgb = ft_split(m->line + 2, ',');
		if (!m->rgb || !m->rgb[0] || !m->rgb[1] || !m->rgb[2])
			return (ft_free_split(m->rgb), printf("Error: rgb\n"));
		if (ft_atoi(m->rgb[0]) < 0 || ft_atoi(m->rgb[0]) > 255
			|| ft_atoi(m->rgb[1]) < 0 || ft_atoi(m->rgb[1]) > 255
			|| ft_atoi(m->rgb[2]) < 0 || ft_atoi(m->rgb[2]) > 255)
			return (ft_free_split(m->rgb), printf("Error: rgb\n"));
		if (ft_strncmp(m->line, "F ", 2) == 0)
		{
			data->textures.textures_color.r_f = ft_atoi(m->rgb[0]);
			data->textures.textures_color.g_f = ft_atoi(m->rgb[1]);
			data->textures.textures_color.b_f = ft_atoi(m->rgb[2]);
		}
		else if (ft_strncmp(m->line, "C ", 2) == 0)
		{
			data->textures.textures_color.r_c = ft_atoi(m->rgb[0]);
			data->textures.textures_color.g_c = ft_atoi(m->rgb[1]);
			data->textures.textures_color.b_c = ft_atoi(m->rgb[2]);
		}
		ft_free_split(m->rgb);
	}
	return (0);
}
