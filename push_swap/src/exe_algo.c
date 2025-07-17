/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   exe_algo.c                                         :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: ypanares <ypanares@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/02/05 10:51:19 by ypanares          #+#    #+#             */
/*   Updated: 2024/02/07 09:10:30 by ypanares         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "../headers/push_swap.h"

void	ft_videa(t_list **a, t_list **b, int size, int medium)
{
	int	lastindex;

	lastindex = size;
	if (size > 3)
	{
		while (size > 3)
		{
			if ((*a)->index == 1)
				ft_ra(a);
			if ((*a)->index == lastindex)
				ft_ra(a);
			if ((*a)->index < medium && (*a)->index != 1 && (*b) != NULL)
			{
				ft_pb(b, a);
				ft_rb(b);
				size--;
			}
			else
			{
				ft_pb(b, a);
				size--;
			}
		}
	}
}

void	ft_ifrrr(t_list **a, t_list **b, t_list *tempb)
{
	if ((tempb)->rrab == 1 && (tempb)->rraplage == 1)
	{
		while (tempb->pos != 0 && tempb->posplage != 0)
		{
			ft_rrr(a, b);
			(tempb)->pos = (tempb)->pos - 1;
			(tempb)->posplage = (tempb)->posplage - 1;
		}
	}
	else if ((tempb)->rrab == 0 && (tempb)->rraplage == 0)
	{
		while (tempb->pos != 0 && tempb->posplage != 0)
		{
			ft_rr(a, b);
			(tempb)->pos = (tempb)->pos - 1;
			(tempb)->posplage = (tempb)->posplage - 1;
		}
	}
}

void	ft_exclista(t_list **a, t_list *tempb)
{
	while ((tempb)->posplage != 0)
	{
		if ((tempb)->rraplage == 1)
			ft_rra(a);
		else if ((tempb)->rraplage == 0)
			ft_ra(a);
		(tempb)->posplage = (tempb)->posplage - 1;
	}
}

void	ft_exclistb(t_list **b, t_list *tempb)
{
	while ((tempb)->pos != 0)
	{
		if ((tempb)->rrab == 1)
			ft_rrb(b);
		else if ((tempb)->rrab == 0)
			ft_rb(b);
		(tempb)->pos = (tempb)->pos - 1;
	}
}

void	ft_align(t_list **a)
{
	t_list	*searchfirst;

	searchfirst = *a;
	poslist(a, 1, ft_size(a), 0);
	while (searchfirst->index != 1)
		searchfirst = searchfirst->next;
	while (searchfirst->pos != 0)
	{
		if (searchfirst->rraplage == 1)
			ft_rra(a);
		else
			ft_ra(a);
		searchfirst->pos = searchfirst->pos - 1;
	}
}
