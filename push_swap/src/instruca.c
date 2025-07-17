/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   instruca.c                                         :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: ypanares <ypanares@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/02/05 10:51:19 by ypanares          #+#    #+#             */
/*   Updated: 2024/02/07 09:10:30 by ypanares         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "../headers/push_swap.h"

void	ft_sa(t_list **lst)
{
	t_list	*tempfirst;
	t_list	*tempsecond;

	tempfirst = *lst;
	*lst = (*lst)->next;
	tempsecond = (*lst)->next;
	(*lst)->next = tempfirst;
	tempfirst->next = tempsecond;
	write (1, "sa\n", 3);
}

void	ft_pa(t_list **a, t_list **b)
{
	t_list	*tempfirstb;

	if (*b == NULL)
		return ;
	tempfirstb = *b;
	*b = (*b)->next;
	tempfirstb->next = *a;
	*a = tempfirstb;
	write (1, "pa\n", 3);
}

void	ft_ra(t_list **a)
{
	t_list	*tempfirst;
	t_list	*temp;

	tempfirst = *a;
	temp = (*a)->next;
	while (temp->next != NULL)
		temp = (temp)->next;
	temp->next = tempfirst;
	*a = (*a)->next;
	tempfirst->next = NULL;
	write (1, "ra\n", 3);
}

void	ft_rra(t_list **a)
{
	t_list	*templast;
	t_list	*tempbeforelast;
	t_list	*temp;

	temp = *a;
	templast = *a;
	while (templast->next != NULL)
	{
		tempbeforelast = templast;
		templast = templast->next;
	}
	tempbeforelast->next = NULL;
	templast->next = temp;
	*a = templast;
	write (1, "rra\n", 4);
}
