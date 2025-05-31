/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_lstclear.c                                      :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: ypanares <marvin@42.fr>                    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/10/05 15:19:46 by ypanares          #+#    #+#             */
/*   Updated: 2023/10/05 15:30:15 by ypanares         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "libft.h"

void	ft_lstclear(t_list **lst, void (*del)(void*))
{
	t_list	*temp;

	temp = *lst;
	if (!temp)
		return ;
	while (temp->next)
	{
		del(temp->content);
		*lst = temp;
		temp = temp->next;
		free(*lst);
	}
	del(temp->content);
	free(temp);
	temp = NULL;
	*lst = NULL;
	lst = NULL;
}
