/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_strdup.c                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mmacia <marvin@42.fr>                      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/10/04 12:28:21 by mmacia            #+#    #+#             */
/*   Updated: 2023/10/04 12:28:25 by mmacia           ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */
#include "libft.h"

char	*ft_strdup(const char *str)
{
	char	*duplic;
	int		i;

	i = -1;
	duplic = malloc((ft_strlen(str) + 1) * sizeof(char));
	if (!duplic)
		return (NULL);
	while (str[++i])
		duplic[i] = str[i];
	duplic[i] = '\0';
	return (duplic);
}
