/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   small_sort.c                                       :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: ypanares <ypanares@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/02/05 10:51:19 by ypanares          #+#    #+#             */
/*   Updated: 2024/02/07 09:10:30 by ypanares         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "../headers/push_swap.h"

void	ft_three(t_list **a)
{
	t_list	*temp;

	while (ft_checkordre(a) != 0)
	{
		temp = *a;
		if ((temp->index > temp->next->index)
			&& (temp->index > temp->next->next->index))
			ft_ra(a);
		else if ((((temp)->index < (temp)->next->index)
				&& ((temp)->index < (temp)->next->next->index))
			|| (((temp)->next->next->index < (temp)->index)
				&& ((temp)->next->next->index < (temp)->next->index)))
			ft_rra(a);
		else
			ft_sa(a);
	}
}

void	ft_two(t_list **a)
{
	t_list	*temp;

	temp = *a;
	if ((temp)->index > (temp)->next->index)
		ft_sa(a);
	return ;
}

int	ft_checkordre(t_list **a)
{
	t_list	*temp;

	temp = *a;
	while (temp->next != NULL)
	{
		if (temp->index > temp->next->index)
			return (1);
		temp = temp->next;
	}
	return (0);
}
