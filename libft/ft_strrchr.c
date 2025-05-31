/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   strrchr.c                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: ypanares <marvin@42.fr>                    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/10/02 12:29:19 by ypanares          #+#    #+#             */
/*   Updated: 2023/10/02 12:29:21 by ypanares         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "libft.h"

int	ft_last(const char *str, int c)
{
	str++;
	while (*str && *str != (unsigned char)c)
		str++;
	if (*str == (unsigned char)c)
		return (1);
	return (0);
}

char	*ft_strrchr(const char *str, int c)
{
	while (*str && (*str != (unsigned char)c || ft_last(str, c)))
		str++;
	if (*str == (unsigned char)c)
		return ((char *)str);
	return (0);
}
