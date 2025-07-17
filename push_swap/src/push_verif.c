/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   push_verif.c                                       :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: ypanares <ypanares@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/02/05 10:51:19 by ypanares          #+#    #+#             */
/*   Updated: 2024/02/07 09:10:30 by ypanares         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "../headers/push_swap.h"

int	ft_doublecheck(char **tabarg)
{
	int	i;
	int	j;

	i = 0;
	while (tabarg[i] != NULL)
	{
		j = i + 1;
		while (tabarg[j] != NULL)
		{
			if (ft_strcmp(tabarg[i], tabarg[j]) == 1)
			{
				write (2, "Error\n", 6);
				return (1);
			}
			j++;
		}
		i++;
	}
	return (0);
}

int	ft_error(char *argv)
{
	int	i;
	int	sign;

	i = 0;
	sign = 0;
	while (argv[i] != '\0')
	{
		if (argv[0] == '-' && sign == 0)
		{
			sign = 1;
			i++;
		}
		if (argv[i] < '0' || argv[i] > '9')
			return (1);
		i++;
	}
	return (0);
}

int	ft_intmax(char *s)
{
	if (ft_strlen(s) > 16)
		return (1);
	if (s[0] == '-')
	{
		if (ft_atoi(s) < -2147483648)
			return (1);
	}
	else
	{
		if (ft_atoi(s) > 2147483647)
			return (1);
	}
	return (0);
}

int	ft_strcmp(char *s1, char *s2)
{
	int	i;
	int	j;

	i = 0;
	j = 0;
	while (s1[i] != '\0' && s2[j] != '\0')
	{
		if (s1[i] != s2[i])
			return (0);
		i++;
		j++;
	}
	if (s1[i] != s2[j])
		return (0);
	return (1);
}

int	ft_strchr(char *argv)
{
	int	i;

	i = 0;
	while (argv[i] != '\0')
	{
		if (argv[i] == ' ')
			return (0);
		i++;
	}
	return (1);
}
