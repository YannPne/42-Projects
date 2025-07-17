/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   check.c                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: ypanares <marvin@42.fr>                    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/07/03 11:13:09 by ypanares          #+#    #+#             */
/*   Updated: 2024/07/03 11:13:17 by ypanares         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "philosophers.h"

long long	get_timestamp(void)
{
	struct timeval	tv;

	gettimeofday(&tv, NULL);
	return (tv.tv_sec * 1000 + tv.tv_usec / 1000);
}

int	win(t_data *data)
{
	int	i;

	i = 0;
	while (i < data->number_of_philosophers)
	{
		if (data->number_of_eat == 0)
			return (0);
		else if (data->philo[i].nb_eat < data->number_of_eat)
			return (0);
		i++;
	}
	return (1);
}

int	lose(t_data *data)
{
	long int	time;
	int			i;

	i = 0;
	time = get_timestamp();
	while (i < data->number_of_philosophers)
	{
		if (time >= (data->philo[i].last_eat + (long int)data->time_to_die))
			return (1);
		i++;
	}
	return (0);
}
