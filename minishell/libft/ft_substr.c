/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_substr.c                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mmacia <marvin@42.fr>                      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/10/04 16:05:44 by mmacia            #+#    #+#             */
/*   Updated: 2023/10/04 16:05:45 by mmacia           ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */
#include "libft.h"

char	*ft_substr(const char *s, unsigned int start, size_t size)
{
	unsigned int	i;
	unsigned int	j;
	char			*dest;

	j = 0;
	i = 0;
	if (start > (unsigned int)ft_strlen(s))
	{
		dest = (char *)malloc(sizeof(char));
		dest[0] = '\0';
		return (dest);
	}
	while (s[start + i] && size--)
		i++;
	dest = (char *)malloc((i + 1) * sizeof(char));
	if (!dest)
		return (NULL);
	while (s[start] && j < i)
	{
		dest[j++] = s[start++];
	}
	dest[j] = '\0';
	return (dest);
}
