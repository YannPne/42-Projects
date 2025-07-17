/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   pos_list.c                                         :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: ypanares <ypanares@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/02/05 10:51:19 by ypanares          #+#    #+#             */
/*   Updated: 2024/02/07 09:10:30 by ypanares         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "../headers/push_swap.h"

void	poslist(t_list **list, int srclist, int size, int i)
{
	int		aftermidle;
	t_list	*temp;

	i = 0;
	temp = *list;
	aftermidle = (size / 2);
	if (size % 2 == 0)
		aftermidle = (size / 2) - 1;
	while (temp != NULL)
	{
		(temp)->pos = i;
		(temp)->rrab = 0;
		(temp)->rraplage = 0;
		if ((temp)->pos > (size / 2))
		{
			(temp)->pos = aftermidle;
			aftermidle--;
			if (srclist == 0)
				(temp)->rrab = 1;
			else if (srclist == 1)
				(temp)->rraplage = 1;
		}
		temp = temp->next;
		i++;
	}
}

void	checkfirstlastplage(t_list **a, t_list *b)
{
	t_list	*first;
	t_list	*last;
	t_list	*tempa;

	first = *a;
	tempa = *a;
	while (tempa->next != NULL)
		tempa = tempa->next;
	last = tempa;
	if (b->index < first->index && b->index > last->index)
	{
		b->posplage = first->pos;
		b->rraplage = first->rrab;
	}
}

void	checkplage(t_list **a, t_list **b, t_list *tempb)
{
	t_list	*tempa;

	tempb = *b;
	while (tempb != NULL)
	{
		tempa = *a;
		checkfirstlastplage(a, tempb);
		while ((tempa->next != NULL))
		{
			if ((tempb->index > tempa->index)
				&& (tempb->index < tempa->next->index))
			{
				(tempb)->posplage = (tempa)->next->pos;
				if ((tempa)->next->rraplage == 1)
				{
					(tempb)->rraplage = 1;
					(tempb)->posplage = (tempa)->next->pos;
				}
				tempa = tempa->next;
				break ;
			}
			tempa = tempa->next;
		}
		tempb = tempb->next;
	}
}

void	checkcostb(t_list **b)
{
	t_list	*tempb;

	tempb = *b;
	while (tempb != NULL)
	{
		(tempb)->cost = ((tempb)->pos + (tempb)->posplage) + 1;
		if ((tempb)->rrab == 1 && (tempb)->rraplage == 1)
		{
			if ((tempb)->pos <= (tempb)->posplage)
				(tempb)->cost = (tempb)->cost - (tempb)->pos;
			else if ((tempb)->posplage < (tempb)->pos)
				(tempb)->cost = (tempb)->cost - (tempb)->posplage;
		}
		tempb = tempb->next;
	}
}

int	choicenode(t_list **b, int compteur)
{
	t_list		*temp;
	t_list		*second;
	int			resultpos;
	long int	costmin;

	second = *b;
	temp = *b;
	resultpos = 0;
	costmin = 658067455;
	while (temp != NULL)
	{
		second = *b;
		while (second != NULL)
		{
			if (temp->cost < costmin)
			{
				costmin = temp->cost;
				resultpos = compteur;
			}
			second = second->next;
		}
		compteur++;
		temp = temp->next;
	}
	return (resultpos);
}
