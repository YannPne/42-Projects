/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   solong.c                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: ypanares <marvin@42.fr>                    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/12/22 18:46:39 by ypanares          #+#    #+#             */
/*   Updated: 2023/12/22 18:47:47 by ypanares         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "so_long.h"

int	check_map2(char *ligne, t_info	*info)
{
	if (info->nb_ligne == 0 || ligne[info->nb_case - 1] != '\n')
	{
		if (ligne[info->nb_case - 1] != '\n'
			&& info->nb_case - 1 != ft_strlen(ligne))
			return (0);
		while (*ligne)
			if (*ligne++ != '1' && *(ligne - 1) != '\n')
				return (0);
	}
	else
	{
		if (info->nb_case != ft_strlen(ligne)
			|| ligne[0] != '1' || ligne[info->nb_case - 2] != '1')
			return (0);
		while (*ligne)
		{
			if (*ligne == 'P')
				info->nb_pd++;
			if (*ligne == 'C')
				info->nb_collect++;
			if (*ligne++ == 'E')
				info->nb_exit++;
		}
	}
	return (1);
}

int	check_map(int fd, t_vars *vars)
{
	char	*ligne;
	t_info	info;

	info.nb_exit = 0;
	info.nb_collect = 0;
	info.nb_ligne = 0;
	info.nb_pd = 0;
	ligne = get_next_line(fd);
	if (!ligne)
		return (0);
	info.nb_case = ft_strlen(ligne);
	while (ligne)
	{
		if (!check_map2(ligne, &info))
			return (0);
		free(ligne);
		ligne = get_next_line(fd);
		info.nb_ligne++;
	}
	if (info.nb_pd != 1 || info.nb_exit != 1 || info.nb_collect < 1)
		return (0);
	vars->x = info.nb_case - 1;
	vars->y = info.nb_ligne;
	return (1);
}

void	check_possible2(t_vars *vars, int i, int *e)
{
	if (vars->img.tab[i][0] != -1 && not_in_tab(vars,
		vars->img.tab[i][0] + 1, vars->img.tab[i][1]))
	{
		vars->img.tab[i + ++(*e)][0] = vars->img.tab[i][0] + 1;
		vars->img.tab[i + *e][1] = vars->img.tab[i][1];
	}
	if (vars->img.tab[i][0] != -1 && not_in_tab(vars,
		vars->img.tab[i][0] - 1, vars->img.tab[i][1]))
	{
		vars->img.tab[i + ++(*e)][0] = vars->img.tab[i][0] - 1;
		vars->img.tab[i + *e][1] = vars->img.tab[i][1];
	}
	if (vars->img.tab[i][0] != -1 && not_in_tab(vars,
		vars->img.tab[i][0], vars->img.tab[i][1] + 1))
	{
		vars->img.tab[i + ++(*e)][0] = vars->img.tab[i][0];
		vars->img.tab[i + *e][1] = vars->img.tab[i][1] + 1;
	}
	if (vars->img.tab[i][0] != -1 && not_in_tab(vars,
		vars->img.tab[i][0], vars->img.tab[i][1] - 1))
	{
		vars->img.tab[i + ++(*e)][0] = vars->img.tab[i][0];
		vars->img.tab[i + *e][1] = vars->img.tab[i][1] - 1;
	}
}

int	check_possible(t_vars *vars)
{
	int	i;
	int	e;

	vars->img.possible_check = 0;
	i = 0;
	e = 0;
	set_tab(vars);
	vars->img.tab[0][0] = vars->img.x_p;
	vars->img.tab[0][1] = vars->img.y_p;
	while (i < vars->img.case_nowall)
	{
		check_possible2(vars, i, &e);
		if (e > 0)
			e--;
		i++;
	}
	if (vars->img.possible_check == (vars->img.acollect + 1))
		return (1);
	return (0);
}

int	ft_strncmp(const char *s1, const char *s2, size_t n)
{
	while ((*s1 || *s2) && n--)
	{
		if (*s1 != *s2)
		{
			return ((unsigned char)*s1 - (unsigned char)*s2);
		}
		s1++;
		s2++;
	}
	return (0);
}
