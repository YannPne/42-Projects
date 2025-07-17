/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   main.c                                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: ypanares <marvin@42.fr>                    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/07/03 11:13:47 by ypanares          #+#    #+#             */
/*   Updated: 2024/07/03 11:13:49 by ypanares         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "philosophers.h"

void	ft_free(t_data *data)
{
	int	i;

	i = -1;
	while (++i < data->number_of_philosophers)
		pthread_join(data->philo[i].thread, NULL);
	i = -1;
	while (++i < data->number_of_philosophers)
		pthread_mutex_destroy(&(data->forks[i]));
	pthread_mutex_destroy(&(data->print));
	free(data->philo);
	free(data->forks);
}

int	main(int argc, char **argv)
{
	t_data	data;

	if (!(argc == 5 || argc == 6))
		return (printf("Pas le bon nb d'arg"));
	if (atoi(argv[1]) == 1)
		return (printf("Le philosophe (1) pense\nle philosophe (1) est dead\n"));
	if (init_info(&data, argv, argc))
		return (printf("error init info"));
	if (init_philo(&data))
		return (printf("error init philo"));
	ft_free(&data);
}
