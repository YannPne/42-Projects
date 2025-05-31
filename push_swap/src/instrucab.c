/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   instrucab.c                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: ypanares <ypanares@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/02/05 10:51:19 by ypanares          #+#    #+#             */
/*   Updated: 2024/02/07 09:10:30 by ypanares         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "../headers/push_swap.h"

void	ft_ss(t_list **a, t_list **b)
{
	t_list	*tempfirst;
	t_list	*tempsecond;

	tempfirst = *a;
	*a = (*a)->next;
	tempsecond = (*a)->next;
	(*a)->next = tempfirst;
	tempfirst->next = tempsecond;
	tempfirst = *b;
	*b = (*b)->next;
	tempsecond = (*b)->next;
	(*b)->next = tempfirst;
	tempfirst->next = tempsecond;
	write (1, "ss\n", 3);
}

void	ft_rr(t_list **a, t_list **b)
{
	t_list	*tempfirst;
	t_list	*temp;

	tempfirst = *a;
	temp = (*a)->next;
	while (temp->next != NULL)
		temp = temp->next;
	temp->next = tempfirst;
	*a = (*a)->next;
	tempfirst->next = NULL;
	tempfirst = *b;
	temp = (*b)->next;
	while (temp->next != NULL)
		temp = temp->next;
	temp->next = tempfirst;
	*b = (*b)->next;
	tempfirst->next = NULL;
	write (1, "rr\n", 3);
}

void	ft_rrr(t_list **a, t_list **b)
{
	t_list	*templast;
	t_list	*tempbeforelast;

	templast = *a;
	while (templast->next != NULL)
	{
		tempbeforelast = templast;
		templast = templast->next;
	}
	tempbeforelast->next = NULL;
	templast->next = *a;
	*a = templast;
	templast = *b;
	while (templast->next != NULL)
	{
		tempbeforelast = templast;
		templast = templast->next;
	}
	tempbeforelast->next = NULL;
	templast->next = *b;
	*b = templast;
	write(1, "rrr\n", 4);
}
