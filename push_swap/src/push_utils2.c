/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   push_utils2.c                                      :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: ypanares <ypanares@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/02/05 10:51:19 by ypanares          #+#    #+#             */
/*   Updated: 2024/02/07 09:10:30 by ypanares         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "../headers/push_swap.h"

t_list	*ft_lstnew(int content)
{
	t_list	*temp;

	temp = (t_list *)malloc(sizeof (t_list));
	if (temp == NULL)
		return (NULL);
	temp->content = content;
	temp->index = 1;
	temp->pos = 0;
	temp->rrab = 0;
	temp->rraplage = 0;
	temp->posplage = 0;
	temp->cost = 0;
	temp->next = NULL;
	return (temp);
}

void	ft_addback(t_list **lst, t_list *new)
{
	t_list	*temp;

	if (*lst == NULL)
	{
		*lst = new;
		return ;
	}
	temp = *lst;
	while (temp->next != NULL)
	{
		temp = temp->next;
	}
	temp->next = new;
}

int	ft_size(t_list **li)
{
	int		i;
	t_list	*temp;

	i = 0;
	temp = *li;
	while (temp != NULL)
	{
		temp = temp->next;
		i++;
	}
	return (i);
}

void	ft_freelist(t_list **a)
{
	t_list	*temp;
	t_list	*tempfree;

	temp = *a;
	while (temp != NULL)
	{
		tempfree = temp;
		temp = temp->next;
		free(tempfree);
	}
	*a = NULL;
}

void	freearg(char **tabarg)
{
	int	i;

	i = 0;
	while (tabarg[i] != NULL)
	{
		free(tabarg[i]);
		i++;
	}
	free(tabarg);
}
