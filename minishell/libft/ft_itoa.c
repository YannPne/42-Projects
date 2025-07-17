/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_itoa.c                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mmacia <marvin@42.fr>                      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/10/06 16:07:53 by mmacia            #+#    #+#             */
/*   Updated: 2023/10/06 16:07:54 by mmacia           ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */
#include "libft.h"

void	ft_putnbr(int nb, char *itoa, int *i)
{
	if (nb < 0)
	{
		nb = -nb;
		itoa[*i] = '-';
		*i = *i + 1;
	}
	if (nb > 9)
	{
		ft_putnbr(nb / 10, itoa, i);
		ft_putnbr(nb % 10, itoa, i);
	}
	else
	{
		itoa[*i] = nb + '0';
		*i = *i + 1;
	}
}

char	*intmin(void)
{
	char	*itoa;

	itoa = malloc(12 * sizeof(char));
	if (itoa == NULL)
		return (NULL);
	ft_strlcpy(itoa, "-2147483648", 12);
	return (itoa);
}

char	*ft_itoa(int n)
{
	char	*itoa;
	int		n_cpy;
	int		i;

	i = 0;
	if (n == -2147483648)
		return (intmin());
	n_cpy = n;
	if (n_cpy < 0)
	{
		n_cpy = -n_cpy;
		i++;
	}
	while (n_cpy >= 10)
	{
		i++;
		n_cpy /= 10;
	}
	itoa = malloc((i + 2) * sizeof(char));
	if (itoa == NULL)
		return (NULL);
	i = 0;
	ft_putnbr(n, itoa, &i);
	itoa[i] = '\0';
	return (itoa);
}
