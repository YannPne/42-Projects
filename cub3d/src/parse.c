/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   parse.c                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mmacia <marvin@42.fr>                      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/07/23 15:21:14 by mmacia            #+#    #+#             */
/*   Updated: 2024/07/23 15:21:17 by mmacia           ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */
#include "../header/cub3d.h"

int	ft_check_map_allocation(t_data *data)
{
	data->map = malloc(sizeof(char *) * (data->map_height + 1));
	if (!data->map)
		return (printf("Error: map allocation failed\n"), 0);
	return (1);
}

void	spawn(t_data *data, float i, char c)
{
	double	olddirx;
	double	oldplanex;

	if (c == 'N')
		i = 1.55;
	else if (c == 'S')
		i = 4.75;
	else if (c == 'W')
		i = 3.15;
	else if (c == 'E')
		i = 0;
	else
		return ;
	olddirx = data->dirx;
	oldplanex = data->planex;
	data->dirx = data->dirx * cos
		(-i) - data->diry * sin(-i);
	data->diry = olddirx * sin
		(-i) + data->diry * cos(-i);
	data->planex = data->planex * cos
		(-i) - data->planey * sin(-i);
	data->planey = oldplanex * sin
		(-i) + data->planey * cos(-i);
}

int	ft_handle_map_line(t_data *data, char *line, int i, int *player_pos_ok)
{
	int		j;

	data->map[i] = ft_strdup(line);
	if (!data->map[i])
		return (printf("Error: failed to duplicate line\n"), free(line), 0);
	j = -1;
	while (line[++j])
	{
		if (!check_map_char(line[j]))
			return (printf("Error: invalid character found\n"), 0);
		if (line[j] == 'N' || line[j] == 'S'
			|| line[j] == 'E' || line[j] == 'W')
		{
			data->posx = j + 0.5;
			data->posy = i + 0.5;
			*player_pos_ok = 1;
			data->map[i][j] = '0';
		}
		spawn(data, i, line[j]);
	}
	return (1);
}

int	ft_read_map(int fd, t_data *data, int *player_pos_ok)
{
	char	*line;
	int		i;
	int		map_ok;

	i = 0;
	map_ok = 0;
	line = get_next_line(fd);
	while (line)
	{
		if (!map_ok && (line[0] == '1' || line[0] == '0'))
			map_ok = 1;
		if (map_ok)
		{
			if (!ft_handle_map_line(data, line, i, player_pos_ok))
				return (0);
			i++;
		}
		free(line);
		line = get_next_line(fd);
	}
	data->map[i] = NULL;
	return (map_ok);
}

int	ft_parse_map(char *filename, t_data *data, int player_pos_ok)
{
	int	fd;

	player_pos_ok = 0;
	data->map_width = 0;
	data->map_height = 0;
	if (!ft_check_map_direction(open(filename, O_RDONLY), data, -1)
		|| !ft_get_map_dimensions
		(filename, data, 0, 0) || !ft_check_map_allocation(data))
		return (0);
	fd = open(filename, O_RDONLY);
	if (!ft_read_map(fd, data, &player_pos_ok))
	{
		close(fd);
		return (0);
	}
	close(fd);
	if (!player_pos_ok)
		return (printf("Error: No player start position\n"), 0);
	return (1);
}
