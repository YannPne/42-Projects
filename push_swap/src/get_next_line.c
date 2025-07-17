/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   get_next_line.c                                    :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: ypanares <ypanares@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/02/05 10:51:19 by ypanares          #+#    #+#             */
/*   Updated: 2024/02/07 09:10:30 by ypanares         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "../headers/push_swap.h"

char	*ft_verif(char *s, int i, int j, int fin)
{
	static char	*temp = NULL;
	char		*tempcpy;

	tempcpy = NULL;
	if (temp != NULL)
	{
		s = ft_join(temp, s);
		temp = NULL;
	}
	while (s[i] != '\n' && s[i] != '\0')
		i++;
	fin = i;
	i++;
	if (ftr_strlen(s) - fin <= 1)
		return (ft_dup(s, fin));
	tempcpy = (char *)malloc(sizeof(char) * (ftr_strlen(s) - fin));
	while (s[i] != '\0')
		tempcpy[j++] = s[i++];
	tempcpy[j] = '\0';
	temp = ft_dupafter(tempcpy);
	if (!temp)
		return (NULL);
	return (ft_dup(s, fin));
}

char	*get_next_line(int fd)
{
	char	*temp;

	if (fd < 0 || BUFFER_SIZE <= 0)
		return (NULL);
	temp = NULL;
	temp = readfile(fd);
	if (!temp)
		return (NULL);
	temp = ft_verif(temp, 0, 0, 0);
	return (temp);
}

char	*readfile(int fd)
{
	int		bytesread;
	char	*buffer;
	char	*temp;
	int		is_found;

	temp = (char *)malloc(sizeof(char));
	temp[0] = '\0';
	buffer = (char *)malloc(sizeof(char) * (BUFFER_SIZE + 1));
	if (buffer == NULL)
		return (NULL);
	bytesread = 1;
	is_found = 1;
	while (is_found != 0 && bytesread > 0)
	{
		bytesread = read(fd, buffer, BUFFER_SIZE);
		if (bytesread == -1)
			return (free(buffer), free(temp), NULL);
		buffer[bytesread] = '\0';
		is_found = ft_verifn(buffer);
		temp = f_strjoin(temp, buffer);
	}
	free(buffer);
	return (temp);
}

int	ft_verifn(char *src)
{
	int	i;

	i = 0;
	while (src[i] != '\0')
	{
		if (src[i] == '\n')
			return (0);
		i++;
	}
	return (1);
}
/*
#include <stdio.h>
int	main(void)
{
	int	fd;
	char	*s;
	char	*file = "caca.txt";

	fd = open(file, O_RDONLY);
	if (fd == -1)
	{
		write(1, "error fd", 8);
		return (1);
	}
	s = get_next_line(fd);
	printf("%s", s);
	free(s);
	s = get_next_line(fd);
	printf("%s", s);
	free(s);
	s = get_next_line(fd);
	printf("%s", s);
	s = get_next_line(fd);
	printf("%s", s);
	free(s);
	// s = get_next_line(fd);
	// printf("%s", s);
	// free(s);
	close(fd);
	return (0);
}
*/
