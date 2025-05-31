/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   checker.c                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: ypanares <ypanares@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/02/05 10:51:19 by ypanares          #+#    #+#             */
/*   Updated: 2024/02/07 09:10:30 by ypanares         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "../headers/push_swap.h"
#include <fcntl.h>
#include <unistd.h>

void	checker(int argc, char **argv)
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
		tabarg = ft_hubverif(argc, argv, tabarg, 0);
	if (tabarg != NULL && ft_doublecheck(tabarg) == 1)
		return (freearg(tabarg));
	if (tabarg == NULL)
		return ;
	while (tabarg[i] != NULL)
	{
		ft_addback(temp, ft_lstnew(ft_atoi(tabarg[i])));
		i++;
	}
	ft_indexation(temp);
	get_term(temp);
	freearg(tabarg);
	return (ft_freelist(temp));
}

void	get_term(t_list **a)
{
	char		*stack;
	t_list		**b;
	t_list		*nulos;

	nulos = NULL;
	b = &nulos;
	while (1)
	{
		stack = get_next_line(0);
		if (readline(stack, a, b, 0) != 0)
			break ;
		free(stack);
	}
	if ((ft_checkordre(a) != 0) && stack == NULL)
		write(1, "KO\n", 3);
	else if (ft_checkordre(a) == 0 && (*b) == NULL && stack == NULL)
		write(1, "OK\n", 3);
	free(stack);
}

int	readline(char *line, t_list **a, t_list **b, int i)
{
	if (!line)
		return (1);
	while (line[i] != '\0')
	{
		if (line[i] == 's'
			&& (line[i + 1] == 'a' || line[i + 1] == 'b' || line[i + 1] == 's'))
			instrucs(&i, line, a, b);
		if (line[i] == 'r' && line[i + 1] == 'r'
			&& (line[i + 2] == 'a' || line[i + 2] == 'b' || line[i + 2] == 'r'))
			instrucrr(&i, line, a, b);
		if (line[i] == 'r'
			&& (line[i + 1] == 'r' || line[i + 1] == 'a' || line[i + 1] == 'b'))
			instrucr(&i, line, a, b);
		if (line[i] == 'p' && (line[i + 1] == 'a' || line[i + 1] == 'b'))
			instrucp(&i, line, a, b);
		if (line[i] == '\n')
			i++;
		else
		{
			write(1, "Error\n", 6);
			return (1);
		}
	}
	return (0);
}

int	main(int argc, char **argv)
{
	checker(argc, argv);
}
