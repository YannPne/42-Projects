/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   instrucab_checker.c                                :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: ypanares <ypanares@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/02/05 10:51:19 by ypanares          #+#    #+#             */
/*   Updated: 2024/02/07 09:10:30 by ypanares         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "../headers/push_swap.h"

void	ft_sb(t_list **b)
{
	t_list	*tempfirst;
	t_list	*tempsecond;

	tempfirst = *b;
	*b = (*b)->next;
	tempsecond = (*b)->next;
	(*b)->next = tempfirst;
	tempfirst->next = tempsecond;
}

void	ft_pb(t_list **b, t_list **a)
{
	t_list	*tempfirsta;

	tempfirsta = *a;
	*a = tempfirsta->next;
	tempfirsta->next = *b;
	*b = tempfirsta;
}

void	ft_rb(t_list **b)
{
	t_list	*tempfirst;
	t_list	*temp;

	tempfirst = *b;
	temp = (*b)->next;
	while (temp->next != NULL)
		temp = (temp)->next;
	temp->next = tempfirst;
	*b = (*b)->next;
	tempfirst->next = NULL;
}

void	ft_rrb(t_list **b)
{
	t_list	*templast;
	t_list	*tempbeforelast;
	t_list	*temp;

	temp = *b;
	templast = *b;
	while (templast->next != NULL)
	{
		tempbeforelast = templast;
		templast = templast->next;
	}
	tempbeforelast->next = NULL;
	templast->next = temp;
	*b = templast;
}
