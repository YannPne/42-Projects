/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   strnstr.c                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: ypanares <marvin@42.fr>                    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/10/02 12:17:41 by ypanares          #+#    #+#             */
/*   Updated: 2023/10/02 12:22:52 by ypanares         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "libft.h"

char	*ft_strnstr(const char *h, const char *needle, size_t len)
{
	size_t	c;

	if (*needle == 0 || h == needle)
		return ((char *)h);
	c = ft_strlen(needle);
	while (*h && c <= len--)
	{
		if (!(ft_strncmp((char *)h, (char *)needle, c)))
			return ((char *)h);
		h++;
	}
	return (NULL);
}
