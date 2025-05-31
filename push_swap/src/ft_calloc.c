/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_calloc.c                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: ypanares <ypanares@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/02/05 10:51:19 by ypanares          #+#    #+#             */
/*   Updated: 2024/02/07 09:10:30 by ypanares         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "../headers/push_swap.h"

void	*ft_calloc(size_t nmemb, size_t size)
{
	void	*str;

	if (nmemb > 4294967295 || size > 4294967295)
		return (NULL);
	if (nmemb == 0 || size == 0)
		return (malloc(0));
	str = (void *)malloc(nmemb * size);
	if (str == NULL)
		return (NULL);
	ft_bzero(str, nmemb * size);
	return (str);
}

void	ft_bzero(void *s, size_t n)
{
	size_t	i;
	char	*sp;

	sp = (char *)s;
	i = 0;
	while (i != n)
	{
		sp[i] = 0;
		i++;
	}
}
