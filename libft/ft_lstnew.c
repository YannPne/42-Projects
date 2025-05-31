/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_lstnew.c                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: ypanares <marvin@42.fr>                    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/10/05 12:55:25 by ypanares          #+#    #+#             */
/*   Updated: 2023/10/05 12:58:00 by ypanares         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "libft.h"

t_list	*ft_lstnew(void *content)
{
	t_list	*strt;

	strt = (t_list *)malloc(sizeof(*strt));
	if (!strt)
		return (NULL);
	strt->content = content;
	strt->next = NULL;
	return (strt);
}
