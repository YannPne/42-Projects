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

#ifndef PHILOSOPHERS_H
# define PHILOSOPHERS_H

# include <pthread.h>
# include <stdio.h>
# include <stdlib.h>
# include <unistd.h>
# include <stdbool.h>
# include <sys/time.h>
# include <limits.h>

typedef struct s_data	t_data;

typedef struct s_philo
{
	pthread_t		thread;
	int				id;
	int				nb_eat;
	long int		start_time;
	long int		last_eat;
	t_data			*data;
	pthread_mutex_t	*left_fork;
	pthread_mutex_t	*right_fork;
}		t_philo;

typedef struct s_data
{
	int				number_of_philosophers;
	int				time_to_die;
	int				time_to_eat;
	int				time_to_sleep;
	int				number_of_eat;
	int				finish;
	long int		start_time;
	t_philo			*philo;
	pthread_mutex_t	*forks;
	pthread_mutex_t	print;
	pthread_mutex_t	check;
}		t_data;

int				init_info(t_data *data, char **argv, int argc);
int				init_philo(t_data *data);
int				win(t_data *data);
int				lose(t_data *data);
long long int	get_timestamp(void);
long			get_elapsed_time(long start_time);
void			ft_free(t_data *data);
void			print_status(t_philo *philo, char *status);
void			*start_routine(void *arg);
void			ft_sleep(t_philo *philo);
void			ft_eat(t_philo *philo);

#endif
