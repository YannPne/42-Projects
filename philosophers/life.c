/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   life.c                                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: ypanares <marvin@42.fr>                    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/07/03 11:13:37 by ypanares          #+#    #+#             */
/*   Updated: 2024/07/03 11:13:38 by ypanares         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "philosophers.h"

void	ft_sleep(t_philo *philo)
{
	if (philo->data->finish)
		print_status(philo, "dort");
	usleep(philo->data->time_to_sleep * 1000);
}

void	ft_eat(t_philo *philo)
{
	pthread_mutex_lock(philo->left_fork);
	pthread_mutex_lock(philo->right_fork);
	print_status(philo, "prend les fourchettes");
	print_status(philo, "mange");
	philo->last_eat = get_timestamp();
	usleep(philo->data->time_to_eat * 1000);
	philo->nb_eat++;
	pthread_mutex_unlock(philo->left_fork);
	pthread_mutex_unlock(philo->right_fork);
}

void	print_status(t_philo *philo, char *status)
{
	pthread_mutex_lock(&philo->data->print);
	if (philo->data->finish)
		printf("%lld Le philosophe (%d) : %s\n",
			get_timestamp(), philo->id, status);
	pthread_mutex_unlock(&philo->data->print);
}

int	last_eat(t_philo *philo)
{
	if (win(philo->data) && philo->data->finish)
	{
		printf("%lld Les philosophes ont manger %d fois sur %d\n",
			get_timestamp(), philo->nb_eat, philo->nb_eat);
		philo->data->finish = 0;
		pthread_mutex_unlock(&philo->data->check);
		return (1);
	}
	return (0);
}

void	*start_routine(void *arg)
{
	t_philo	*philo;

	philo = (t_philo *)arg;
	while (1)
	{
		pthread_mutex_lock(&philo->data->check);
		usleep(3000);
		if (last_eat(philo))
			return (philo);
		if ((philo->last_eat != 0 && lose(philo->data)) || !philo->data->finish)
		{
			if (philo->data->finish)
				printf("%lld Le philosophe (%d) est dead\n",
					get_timestamp(), philo->id);
			philo->data->finish = 0;
			pthread_mutex_unlock(&philo->data->check);
			return (philo);
		}
		pthread_mutex_unlock(&philo->data->check);
		ft_eat(philo);
		ft_sleep(philo);
		if (philo->data->finish)
			print_status(philo, "pense");
	}
}
