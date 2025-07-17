/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   init.c                                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: ypanares <marvin@42.fr>                    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/07/03 11:13:26 by ypanares          #+#    #+#             */
/*   Updated: 2024/07/03 11:13:28 by ypanares         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "philosophers.h"

int	init_info(t_data *data, char **argv, int argc)
{
	int	i;

	i = 0;
	data->number_of_philosophers = atoi(argv[1]);
	data->time_to_die = atoi(argv[2]);
	data->time_to_eat = atoi(argv[3]);
	data->time_to_sleep = atoi(argv[4]);
	if (argc == 6)
		data->number_of_eat = atoi(argv[5]);
	else
		data->number_of_eat = 0;
	data->finish = 1;
	data->philo = malloc(sizeof(t_philo)
			* data->number_of_philosophers);
	data->forks = malloc(sizeof(pthread_mutex_t)
			* data->number_of_philosophers);
	if (!data->philo || !data->forks)
		return (1);
	while (data->number_of_philosophers > i)
		pthread_mutex_init(&data->forks[i++], NULL);
	pthread_mutex_init(&data->print, NULL);
	pthread_mutex_init(&data->check, NULL);
	return (0);
}

int	init_philo(t_data *data)
{
	int	i;

	i = -1;
	data->start_time = get_timestamp();
	while (++i < data->number_of_philosophers)
	{
		data->philo[i].id = i;
		data->philo[i].nb_eat = 0;
		data->philo[i].last_eat = get_timestamp() + data->time_to_die;
		data->philo[i].data = data;
		data->philo[i].left_fork = &data->forks[i];
		data->philo[i].right_fork = &data->forks[(i + 1)
			% data->number_of_philosophers];
	}
	i = -1;
	while (++i < data->number_of_philosophers)
	{
		if (pthread_create(&data->philo[i].thread, NULL,
				start_routine, &data->philo[i]) != 0)
			return (1);
	}
	return (0);
}
