/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   push_swap.c                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: ypanares <ypanares@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/02/05 10:51:19 by ypanares          #+#    #+#             */
/*   Updated: 2024/02/07 09:10:30 by ypanares         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "../headers/push_swap.h"

void	ft_push_swap(int argc, char **argv)
{
	int		i;
	char	**tabarg;
	t_list	**temp;
	t_list	*nulos;

	i = 0;
	temp = &nulos;
	tabarg = NULL;
	nulos = NULL;
	if (argc > 2 || argc == 2)
		tabarg = ft_hubverif(argc, argv, tabarg, -1);
	if (tabarg != NULL && ft_doublecheck(tabarg) == 1)
		return (freearg(tabarg));
	if (tabarg == NULL)
		return ;
	while (tabarg[i] != NULL)
	{
		ft_addback(temp, ft_lstnew(ft_atoi(tabarg[i])));
		i++;
	}
	ft_hublist(temp);
	freearg(tabarg);
	ft_freelist(temp);
	return ;
}

void	ft_hublist(t_list **temp)
{
	ft_indexation(temp);
	if (ft_checkordre(temp) == 0)
		return ;
	if (ft_size(temp) == 2)
	{
		ft_two(temp);
		return ;
	}
	ft_startalgo(temp, ft_size(temp));
}

char	**ft_hubverif(int argc, char **argv, char **tabarg, int i)
{
	int	j;

	j = 0;
	if (argc == 2)
	{
		if (ft_strchr(argv[1]) == 0)
			tabarg = ft_split(argv[1], ' ');
		else
			return (NULL);
		while (tabarg[++i] != NULL)
		{
			if (ft_error(tabarg[i]) == 1 || ft_intmax(tabarg[i]) == 1)
				return (write(2, "Error\n", 6), freearg(tabarg), tabarg = NULL);
		}
	}
	else if (argc > 2)
	{
		while (argv[++j] != NULL)
		{
			if (ft_error(argv[j]) == 1 || ft_intmax(argv[j]) == 1)
				return (write(2, "Error\n", 6), tabarg = NULL);
		}
		tabarg = ft_duparg(argc, argv);
	}
	return (tabarg);
}
