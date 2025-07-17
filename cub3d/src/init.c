/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   init.c                                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mmacia <marvin@42.fr>                      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/07/23 15:21:14 by mmacia            #+#    #+#             */
/*   Updated: 2024/07/23 15:21:17 by mmacia           ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "../header/cub3d.h"

int	ft_is_valid(char *input)
{
	if (!input)
		return (0);
	if (ft_strlen
		(input) > 4 && ft_strncmp(input + ft_strlen(input) - 4, ".cub", 4) == 0)
		return (1);
	return (printf("Error : enter valid map .cub\n"));
}

int	readmap(int fd, char tab[500][500])
{
	char	*line;
	int		i;
	int		j;
	int		ok;

	line = get_next_line(fd);
	j = 0;
	ok = 0;
	while (line)
	{
		i = -1;
		if (ok)
		{
			while (line && line[++i] && line[i] != '\n')
				tab[j][i] = line[i];
			tab[j++][i] = '\0';
		}
		if (line && line[0] == 'C')
			ok = 1;
		free(line);
		line = get_next_line(fd);
	}
	return (j);
}

int	checkparam(char c)
{
	if (c != '0' && c != '1' && c != 'N'
		&& c != 'S' && c != 'E' && c != 'W')
		return (1);
	return (0);
}

void	checkmap(char tab[500][500], int j, int i)
{
	while (--j >= 0)
	{
		i = -1;
		while (tab[j][++i])
		{
			if (tab[j][i] == '0')
			{
				if (j == 0 || i == 0)
					exit(printf("Error : no valid map"));
				if (checkparam(tab[j - 1][i]))
					exit(printf("Error : no valid map"));
				if (checkparam(tab[j + 1][i]))
					exit(printf("Error : no valid map"));
				if (checkparam(tab[j][i + 1]))
					exit(printf("Error : no valid map"));
				if (checkparam(tab[j][i - 1]))
					exit(printf("Error : no valid map"));
			}
		}
	}
}

void	ft_init(t_data *data, char *input, int i, int j)
{
	int		fd;
	char	tab[500][500];

	fd = open(input, O_RDONLY);
	while (++i < 500)
	{
		j = -1;
		while (++j < 500)
			tab[i][j] = '\0';
	}
	checkmap(tab, readmap(fd, tab) + 1, 0);
	close(fd);
	if (!(ft_is_valid(input) == 1))
		ft_close();
	data->dirx = 1;
	data->diry = 0;
	data->planex = 0;
	data->planey = 0.66;
	if (!ft_parse_map(input, data, 0))
		ft_close();
	data->mlx_ptr = mlx_init();
	data->win_ptr = mlx_new_window(data->mlx_ptr, X, Y, "Cub3D");
	data->image.img = NULL;
}
