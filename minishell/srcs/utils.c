/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   utils.c                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: ypanares <marvin@42.fr>                    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/07/23 18:43:32 by ypanares          #+#    #+#             */
/*   Updated: 2024/07/23 18:43:35 by ypanares         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */
#include "../header/minishell.h"

int	str_in_str(char *dest, const char *src)
{
	int	i;

	i = strlen(src);
	while (--i >= 0)
	{
		if (dest[i] != src[i])
			return (0);
	}
	return (1);
}

int	metacaractere(char c)
{
	const char	*meta_caracteres;
	int			i;

	i = -1;
	meta_caracteres = "*?[]|$!.(){}~#&;><\'\\\"";
	while (meta_caracteres[++i])
		if (meta_caracteres[i] == c)
			return (1);
	return (0);
}

int	metacaractere_minishell(char c)
{
	int			i;
	const char	*meta_caracteres;

	i = -1;
	meta_caracteres = "|<>";
	while (meta_caracteres[++i])
		if (meta_caracteres[i] == c)
			return (1);
	return (0);
}

char	*check_folder_redirect_input_double(char *input, char *meta)
{
	int		i;
	int		len;
	char	*files;

	i = 0;
	len = 0;
	while (input[i] != *meta)
		i++;
	i += 2;
	while (input[i] == ' ')
		i++;
	while (ft_isalpha(input[i + len]) || input[i + len] == '.')
		len++;
	files = calloc(len, sizeof(char));
	len = i;
	while (input[i] && (ft_isalpha(input[i]) || input[i] == '.'))
	{
		files[i - len] = input[i];
		i++;
	}
	files[i - len] = '\0';
	return (files);
}

char	*check_folder_redirect_input(char *input, char *meta, int i)
{
	int		len;
	char	*files;

	len = 0;
	while (input[i] != *meta)
		i++;
	if (meta[0] == '>' && meta[1] == '>')
		return (check_folder_redirect_input_double(input, meta));
	if (meta[0] == '>')
		i++;
	while (input[i] == ' ')
		i++;
	while (ft_isalpha(input[i + (++len)]) || input[i + len] == '.')
		len++;
	files = calloc(len, sizeof(char));
	len = i;
	while (input[i] && (ft_isalpha(input[i]) || input[i] == '.'))
	{
		files[i - len] = input[i];
		i++;
	}
	files[i - len] = '\0';
	return (files);
}
