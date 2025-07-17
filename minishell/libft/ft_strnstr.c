/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_strnstr.c                                       :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mmacia <marvin@42.fr>                      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/10/03 17:51:25 by mmacia            #+#    #+#             */
/*   Updated: 2023/10/03 18:39:27 by mmacia           ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */
#include "libft.h"

char	*ft_strnstr(const char *str, const char *to_find, size_t size)
{
	size_t	i;
	size_t	j;

	i = 0;
	if (to_find[0] == '\0')
		return ((char *)str);
	while (str[i] != '\0' && i < size)
	{
		j = 0;
		while (str[i + j] == to_find[j] && to_find[j] != '\0' && i + j < size)
		{
			j++;
			if (to_find[j] == '\0')
				return ((char *)&str[i]);
		}
		i++;
	}
	return (NULL);
}

/*int	main(void)
{
	char	str[] = "je suis moi";
	char	to_find[] = "s";
	printf("%s\n", strstr(str, to_find));
	printf("%s", ft_strstr(str, to_find, 4));
	return 0;
}*/
