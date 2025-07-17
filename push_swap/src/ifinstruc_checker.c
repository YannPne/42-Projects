/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ifinstruca_checker.c                               :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: ypanares <ypanares@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/02/05 10:51:19 by ypanares          #+#    #+#             */
/*   Updated: 2024/02/07 09:10:30 by ypanares         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "../headers/push_swap.h"

void	instrucp(int *i, char *line, t_list **a, t_list **b)
{
	if (line[*i + 1] == 'a')
	{
		ft_pa(a, b);
		*i = *i + 2;
	}
	if (line[*i + 1] == 'b')
	{
		ft_pb(b, a);
		*i = *i + 2;
	}
}

void	instrucr(int *i, char *line, t_list **a, t_list **b)
{
	if (line[*i + 1] == 'r')
	{
		ft_rr(a, b);
		*i = *i + 2;
	}
	if (line[*i + 1] == 'a')
	{
		ft_ra(a);
		*i = *i + 2;
	}
	if (line[*i + 1] == 'b')
	{
		ft_rb(b);
		*i = *i + 2;
	}
}

void	instrucs(int *i, char *line, t_list **a, t_list **b)
{
	if (line[*i + 1] == 's')
	{
		ft_ss(a, b);
		*i = *i + 2;
	}
	if (line[*i + 1] == 'a')
	{
		ft_sa(a);
		*i = *i + 2;
	}
	if (line[*i + 1] == 'b')
	{
		ft_sb(b);
		*i = *i + 2;
	}
}

void	instrucrr(int *i, char *line, t_list **a, t_list **b)
{
	if (line[*i + 2] == 'r')
	{
		ft_rrr(a, b);
		*i = *i + 3;
	}
	if (line[*i + 2] == 'a')
	{
		ft_rra(a);
		*i = *i + 3;
	}
	if (line[*i + 2] == 'b')
	{
		ft_rrb(b);
		*i = *i + 3;
	}
}
